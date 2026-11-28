const DEFAULT_CONFIG = Object.freeze({
  cps: 10,
  jitter: 0.15,
  targetSelector: '#click-target',
  mode: 'burst',
  maxClicks: 1000,
  safetyPauseMs: 5000,
  keys: { trigger: 'Space', stop: 'Escape' }
});

class ConfigLoader {
  constructor(customOverrides = {}) {
    this.raw = this.#deepMerge(DEFAULT_CONFIG, customOverrides);
    return this.#createProxy(this.raw);
  }

  #deepMerge(target, source) {
    const result = { ...target };
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.#deepMerge(target[key] || {}, value);
      } else if (value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }

  #createProxy(obj) {
    return new Proxy(obj, {
      get: (target, prop) => {
        if (prop === 'getValidatedInterval') {
          return () => Math.max(1, 1000 / (target.cps || 10));
        }
        if (prop === 'withJitter') {
          return (baseMs) => {
            const dev = baseMs * (target.jitter || 0);
            return baseMs + (Math.random() * dev * 2 - dev);
          };
        }
        const val = target[prop];
        return typeof val === 'object' && val !== null ? this.#createProxy(val) : val;
      },
      set: (target, prop, value) => {
        if (prop === 'cps' && (typeof value !== 'number' || value <= 0)) {
          throw new RangeError('CPS must be a positive number');
        }
        target[prop] = value;
        return true;
      }
    });
  }

  static loadFromEnv(envPrefix = 'AUTOCLICK_') {
    const overrides = {};
    if (typeof process !== 'undefined' && process && process.env) {
      if (process.env[`${envPrefix}CPS`]) overrides.cps = Number(process.env[`${envPrefix}CPS`]);
      if (process.env[`${envPrefix}MODE`]) overrides.mode = process.env[`${envPrefix}MODE`];
    }
    return new ConfigLoader(overrides);
  }
}

module.exports = { ConfigLoader, DEFAULT_CONFIG };