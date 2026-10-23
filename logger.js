const fs = require('fs');
const path = require('path');

class RotatingClickLogger {
  constructor(options = {}) {
    this.dir = options.dir || './logs';
    this.maxSize = options.maxSize || 50 * 1024;
    this.maxFiles = options.maxFiles || 3;
    this.currentSize = 0;
    this.stream = null;

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
    this._initStream();
  }

  _initStream() {
    if (this.stream) this.stream.end();
    const activePath = path.join(this.dir, 'autoclick.log');

    if (fs.existsSync(activePath)) {
      const stats = fs.statSync(activePath);
      if (stats.size >= this.maxSize) {
        this._rotate(activePath);
      } else {
        this.currentSize = stats.size;
      }
    }

    this.stream = fs.createWriteStream(activePath, { flags: 'a' });
  }

  _rotate(activePath) {
    for (let i = this.maxFiles - 1; i >= 1; i--) {
      const src = path.join(this.dir, `autoclick.${i}.log`);
      const dest = path.join(this.dir, `autoclick.${i + 1}.log`);
      if (fs.existsSync(src)) {
        if (i + 1 > this.maxFiles) fs.unlinkSync(src);
        else fs.renameSync(src, dest);
      }
    }
    if (fs.existsSync(activePath)) {
      fs.renameSync(activePath, path.join(this.dir, 'autoclick.1.log'));
    }
    this.currentSize = 0;
  }

  log(level, payload) {
    const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${typeof payload === 'object' ? JSON.stringify(payload) : payload}\n`;
    const bytes = Buffer.byteLength(entry);

    if (this.currentSize + bytes > this.maxSize) {
      this._initStream();
    }

    this.stream.write(entry);
    this.currentSize += bytes;
  }
}

function createAutoclickLogger(config = {}) {
  const baseLogger = new RotatingClickLogger(config);
  return new Proxy(baseLogger, {
    get(target, prop) {
      if (prop in target || typeof prop === 'symbol') return target[prop];
      return (...args) => target.log(prop, args.length === 1 ? args[0] : args);
    }
  });
}

module.exports = { createAutoclickLogger };