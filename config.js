const DEFAULT_SETTINGS = Object.freeze({
  clickInterval: 80,
  jitterRange: [-3, 3],
  activationKey: 'F8',
  targetTitle: '',
  holdDuration: 15,
  safetyCap: 5000
});

function loadConfig(userOverrides = {}) {
  const store = new Map();
  const keys = new Set([...Object.keys(DEFAULT_SETTINGS), ...Object.keys(userOverrides)]);

  for (const key of keys) {
    const overrideVal = userOverrides[key];
    const defaultVal = DEFAULT_SETTINGS[key];
    store.set(key, overrideVal !== undefined ? overrideVal : defaultVal);
  }

  return new Proxy(store, {
    get(target, prop) {
      if (typeof prop === 'symbol') return undefined;
      if (!target.has(prop)) return undefined;
      const val = target.get(prop);
      if (prop === 'clickInterval') return Math.max(1, Number(val) || 80);
      if (prop === 'safetyCap') return Math.min(10000, Math.max(100, Number(val) || 5000));
      return val;
    },
    set(target, prop, value) {
      target.set(prop, value);
      return true;
    },
    has(target, prop) {
      return target.has(prop);
    }
  });
}

module.exports = { loadConfig, DEFAULT_SETTINGS };