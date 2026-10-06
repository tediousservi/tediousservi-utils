const perf = typeof performance !== 'undefined' ? performance : { now: () => Date.now() };
const queueTask = typeof queueMicrotask !== 'undefined' ? queueMicrotask : (fn) => Promise.resolve().then(fn);

class ClickScheduler {
  constructor(maxCapacity = 4096) {
    this.capacity = maxCapacity;
    this.times = new Float64Array(maxCapacity);
    this.callbacks = new Array(maxCapacity);
    this.head = 0;
    this.tail = 0;
    this.active = false;
  }

  enqueue(delayMs, callback) {
    const nextTail = (this.tail + 1) % this.capacity;
    if (nextTail === this.head) return false;
    this.times[this.tail] = perf.now() + delayMs;
    this.callbacks[this.tail] = callback;
    this.tail = nextTail;
    if (!this.active) {
      this.active = true;
      this.tick();
    }
    return true;
  }

  tick() {
    if (this.head === this.tail) {
      this.active = false;
      return;
    }
    const now = perf.now();
    const target = this.times[this.head];

    if (now >= target) {
      const fn = this.callbacks[this.head];
      this.callbacks[this.head] = null;
      this.head = (this.head + 1) % this.capacity;
      try { fn(); } catch (_) {}
      queueTask(() => this.tick());
    } else if (target - now < 2) {
      queueTask(() => this.tick());
    } else {
      setTimeout(() => this.tick(), 1);
    }
  }
}

module.exports = { ClickScheduler };