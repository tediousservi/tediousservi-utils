const JitterEngine = {
  *gaussianDelay(baseMs, spreadMs = 15) {
    while (true) {
      const u1 = Math.random() || 1e-5;
      const u2 = Math.random() || 1e-5;
      const norm = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      yield Math.max(1, Math.round(baseMs + norm * spreadMs));
    }
  }
};

class ClickQueue {
  #queue = [];
  #drainTimer = null;

  constructor(targetResolver = (selector) => document.querySelector(selector)) {
    this.resolveTarget = targetResolver;
  }

  enqueue(target, options = {}) {
    const delayGen = JitterEngine.gaussianDelay(options.interval || 100, options.jitter || 20);
    this.#queue.push({ target, delayGen, clicks: options.clicks || Infinity });
    if (!this.#drainTimer) this.#step();
    return this;
  }

  #step() {
    if (this.#queue.length === 0) {
      this.#drainTimer = null;
      return;
    }

    const current = this.#queue[0];
    const el = typeof current.target === 'string' ? this.resolveTarget(current.target) : current.target;

    if (el && current.clicks > 0) {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      el.dispatchEvent(event);
      current.clicks--;
    }

    if (current.clicks <= 0 || !el) {
      this.#queue.shift();
    }

    const nextDelay = current ? current.delayGen.next().value : 100;
    this.#drainTimer = setTimeout(() => this.#step(), nextDelay);
  }

  clear() {
    clearTimeout(this.#drainTimer);
    this.#drainTimer = null;
    this.#queue.length = 0;
  }
}

export { JitterEngine, ClickQueue };