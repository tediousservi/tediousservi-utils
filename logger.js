const LOG_LEVELS = Object.freeze({
  DEBUG: 10,
  CLICK: 20,
  WARN: 30,
  ERROR: 40
});

class AutoclickerLogger {
  #capacity;
  #buffer;
  #head = 0;
  #tail = 0;
  #count = 0;

  constructor(capacity = 50) {
    this.#capacity = capacity;
    this.#buffer = new Array(capacity);
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) return target[prop];
        const levelKey = String(prop).toUpperCase();
        if (levelKey in LOG_LEVELS) {
          return (msg, meta = {}) => target.#record(levelKey, msg, meta);
        }
      }
    });
  }

  #record(level, message, meta) {
    const entry = Object.freeze({
      timestamp: Date.now(),
      level,
      message,
      meta: Object.freeze({ ...meta }),
      id: Math.random().toString(36).substring(2, 9)
    });

    this.#buffer[this.#head] = entry;
    this.#head = (this.#head + 1) % this.#capacity;
    if (this.#count < this.#capacity) {
      this.#count++;
    } else {
      this.#tail = (this.#tail + 1) % this.#capacity;
    }
    return entry;
  }

  *flush() {
    while (this.#count > 0) {
      const item = this.#buffer[this.#tail];
      this.#buffer[this.#tail] = undefined;
      this.#tail = (this.#tail + 1) % this.#capacity;
      this.#count--;
      yield item;
    }
  }

  snapshot(minLevel = 'DEBUG') {
    const threshold = LOG_LEVELS[minLevel] || 0;
    const items = [];
    let idx = this.#tail;
    for (let i = 0; i < this.#count; i++) {
      const entry = this.#buffer[idx];
      if (LOG_LEVELS[entry.level] >= threshold) {
        items.push(entry);
      }
      idx = (idx + 1) % this.#capacity;
    }
    return Object.freeze(items);
  }

  purge() {
    this.#buffer.fill(undefined);
    this.#head = 0;
    this.#tail = 0;
    this.#count = 0;
  }
}

module.exports = { AutoclickerLogger, LOG_LEVELS };