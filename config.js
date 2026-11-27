const DEFAULTS = Object.freeze({
  cps: 10,
  jitterMs: 15,
  button: 'left',
  toggleHotkey: 'F6',
  burstMode: false,
  burstCount: 3,
  targetWindow: null
});

const SANITIZERS = {
  cps: (v) => Math.min(Math.max(Number(v) || 10, 1), 500),
  jitterMs: (v) => Math.max(Number(v) || 0, 0),
  button: (v) => ['left', 'right', 'middle'].includes(v) ? v : 'left',
  burstCount: (v) => Math.max(parseInt(v, 10) || 1, 1),
  burstMode: (v) => Boolean(v)
};

class ConfigLoader {
  constructor(customConfig = {}) {
    this._raw = customConfig;
    this._store = this._hydrate(customConfig);
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) return target[prop];
        return target.get(prop);
      }
    });
  }

  _hydrate(source) {
    const merged = Object.create(DEFAULTS);
    for (const [key, value] of Object.entries(source)) {
      if (value !== undefined) {
        const cleanFn = SANITIZERS[key] || ((x) => x);
        merged[key] = cleanFn(value);
      }
    }
    return merged;
  }

  get(key) {
    return this._store[key] ?? DEFAULTS[key];
  }

  merge(newPartial) {
    this._raw = { ...this._raw, ...newPartial };
    this._store = this._hydrate(this._raw);
    return this;
  }

  export() {
    const result = {};
    for (const key of Object.keys(DEFAULTS)) {
      result[key] = this.get(key);
    }
    return result;
  }
}

module.exports = { ConfigLoader, DEFAULTS };