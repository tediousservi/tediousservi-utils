/**
 * Configuration loader with Proxy-based default fallbacks and strict bounds checking.
 */
const DEFAULT_CONFIG = Object.freeze({
  cps: 15,
  clickType: 'single',
  targetButton: 'left',
  jitterMs: 4,
  hotkey: 'F8',
  burstLimit: 100,
  autoStopMs: 0,
  soundFeedback: false,
});

function loadConfig(userOverrides = {}) {
  const merged = { ...DEFAULT_CONFIG };

  Object.keys(userOverrides).forEach((key) => {
    if (key in DEFAULT_CONFIG && userOverrides[key] !== undefined) {
      const defaultType = typeof DEFAULT_CONFIG[key];
      const val = userOverrides[key];

      if (defaultType === 'number') {
        const parsed = Number(val);
        merged[key] = Number.isNaN(parsed) ? DEFAULT_CONFIG[key] : Math.max(0, parsed);
      } else if (defaultType === 'boolean') {
        merged[key] = Boolean(val);
      } else {
        merged[key] = String(val);
      }
    }
  });

  return new Proxy(merged, {
    get(target, prop) {
      if (typeof prop === 'symbol') return Reflect.get(target, prop);
      if (!(prop in target)) {
        console.warn(`[tediousservi-utils] Accessing unknown config key: '${String(prop)}'`);
        return undefined;
      }
      return target[prop];
    },
    set(target, prop, value) {
      if (!(prop in DEFAULT_CONFIG)) {
        throw new Error(`Cannot set unknown configuration key: '${String(prop)}'`);
      }
      if (prop === 'cps' && (typeof value !== 'number' || value <= 0 || value > 500)) {
        throw new RangeError('CPS must be a positive number up to 500');
      }
      target[prop] = value;
      return true;
    }
  });
}

module.exports = {
  DEFAULT_CONFIG,
  loadConfig,
};