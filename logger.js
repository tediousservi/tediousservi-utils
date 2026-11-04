const LOG_LEVELS = Symbol('LOG_LEVELS');
const MAX_ENTRIES = 128;

class AutoclickLogger {
  #buffer = new Array(MAX_ENTRIES);
  #head = 0;
  #count = 0;

  constructor(prefix = '[tediousservi]') {
    this.prefix = prefix;
    this[LOG_LEVELS] = Object.freeze({
      CLICK: '\x1b[32m%s\x1b[0m',
      WARN:  '\x1b[33m%s\x1b[0m',
      ERROR: '\x1b[31m%s\x1b[0m'
    });
  }

  log(level, message, meta = {}) {
    const color = this[LOG_LEVELS][level] || '%s';
    const timestamp = new Date().toISOString().slice(11, 23);
    const entry = { timestamp, level, message, meta, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };

    this.#buffer[this.#head] = entry;
    this.#head = (this.#head + 1) % MAX_ENTRIES;
    if (this.#count < MAX_ENTRIES) this.#count++;

    const formatted = `${this.prefix} [${entry.timestamp}] [${entry.level}] ${entry.message}`;
    console.log(color, formatted, Object.keys(meta).length ? meta : '');
    return entry.id;
  }

  purge(levelFilter = null) {
    const removed = [];
    for (let i = 0; i < MAX_ENTRIES; i++) {
      const item = this.#buffer[i];
      if (item && (!levelFilter || item.level === levelFilter)) {
        removed.push(item);
        this.#buffer[i] = undefined;
      }
    }
    this.#count -= removed.length;
    return removed.length;
  }

  get history() {
    return Array.from({ length: this.#count }, (_, i) => {
      const idx = (this.#head - this.#count + i + MAX_ENTRIES) % MAX_ENTRIES;
      return this.#buffer[idx];
    }).filter(Boolean);
  }
}

module.exports = { AutoclickLogger, defaultLogger: new AutoclickLogger() };