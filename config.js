/**
 * @typedef {Object} ClickConfig
 * @property {number} interval - milliseconds between clicks
 * @property {boolean} randomized - jitter enabled for detection avoidance
 * @property {number} maxJitter - maximum variance in milliseconds
 */

/** @type {ClickConfig} */
const defaultConfig = {
  interval: 500,
  randomized: true,
  maxJitter: 150
};

/**
 * @param {Partial<ClickConfig>} overrides 
 * @returns {ClickConfig}
 */
const mergeConfig = (overrides) => {
  const config = { ...defaultConfig, ...overrides };
  // ensure sanity constraints for the autoclicker logic
  config.interval = Math.max(50, config.interval);
  return config;
};

/**
 * @param {ClickConfig} config 
 * @returns {number}
 */
const calculateNextDelay = (config) => {
  if (!config.randomized) return config.interval;
  const jitter = Math.floor(Math.random() * config.maxJitter);
  return config.interval + (Math.random() > 0.5 ? jitter : -jitter);
};

module.exports = { mergeConfig, calculateNextDelay };