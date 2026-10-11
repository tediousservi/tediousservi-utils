const CONFIG = Object.freeze({
  interval: 100,
  jitter: 0.15,
  selectors: ['.target-btn', '#autoclick-trigger'],
  defaults: {
    maxClicks: 9999,
    bypassAntiCheat: true
  },
  getJitteredInterval: () => {
    const base = CONFIG.interval;
    return Math.floor(base + (Math.random() * base * CONFIG.jitter));
  }
});

const createConfigManager = (initial = {}) => {
  let settings = { ...CONFIG.defaults, ...initial };
  return {
    get: (key) => settings[key],
    set: (key, val) => { settings[key] = val; },
    reset: () => { settings = { ...CONFIG.defaults }; }
  };
};

module.exports = { CONFIG, createConfigManager };