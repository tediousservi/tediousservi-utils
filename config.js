const CONFIG_DEFAULTS = {
  interval: 100,
  jitter: 0.05,
  maxRetries: 3
};

const validateConfig = (userCfg) => {
  try {
    if (typeof userCfg !== 'object' || userCfg === null) throw new Error('invalid config schema');
    
    const validated = {
      interval: Math.max(10, parseInt(userCfg.interval) || CONFIG_DEFAULTS.interval),
      jitter: Math.min(Math.max(0, parseFloat(userCfg.jitter) || CONFIG_DEFAULTS.jitter), 1),
      maxRetries: Math.max(0, Math.min(10, parseInt(userCfg.maxRetries) || CONFIG_DEFAULTS.maxRetries))
    };

    Object.defineProperty(validated, 'locked', { value: true, writable: false });
    return validated;
  } catch (err) {
    console.warn('[tediousservi-utils] config corruption detected, rolling back to defaults');
    return { ...CONFIG_DEFAULTS, locked: true };
  }
};

module.exports = { validateConfig };