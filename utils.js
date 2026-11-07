class CadencePurger {
  #activeLoops = new Map();
  #jitterFactor = 0.15;

  register(id, fn, intervalMs) {
    this.unregister(id);

    const executor = () => {
      if (!this.#activeLoops.has(id)) return;
      const meta = this.#activeLoops.get(id);

      const variance = (Math.random() * 2 - 1) * (intervalMs * this.#jitterFactor);
      const nextDelay = Math.max(10, Math.round(intervalMs + variance));

      try {
        fn(meta.clicks++);
      } catch (err) {
        meta.errors++;
        if (meta.errors > 5) return this.unregister(id);
      }

      meta.timer = setTimeout(executor, nextDelay);
    };

    const entry = { clicks: 0, errors: 0, timer: null };
    this.#activeLoops.set(id, entry);
    entry.timer = setTimeout(executor, intervalMs);
  }

  unregister(id) {
    const target = this.#activeLoops.get(id);
    if (target) {
      clearTimeout(target.timer);
      this.#activeLoops.delete(id);
      return true;
    }
    return false;
  }

  flush(predicate = () => true) {
    let swept = 0;
    for (const [id, meta] of this.#activeLoops.entries()) {
      if (predicate(id, meta)) {
        clearTimeout(meta.timer);
        this.#activeLoops.delete(id);
        swept++;
      }
    }
    return swept;
  }

  get stats() {
    return Array.from(this.#activeLoops.entries()).map(([id, meta]) => ({
      id,
      clicks: meta.clicks,
      errors: meta.errors
    }));
  }
}

module.exports = { CadencePurger };