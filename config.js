/**
 * @typedef {Object} ClickConfig
 * @property {number} interval - Delay in ms
 * @property {number} jitter - Random drift factor
 * @property {boolean} active - Execution state
 */

/** @type {ClickConfig} */
const defaults = {
  interval: 100,
  jitter: 0.15,
  active: false
};

/**
 * @param {Partial<ClickConfig>} overrides
 * @returns {ClickConfig}
 */
const generateConfiguration = (overrides) => {
  const config = { ...defaults, ...overrides };
  
  Object.defineProperty(config, 'getDrift', {
    value: () => Math.floor(config.interval * (1 + (Math.random() - 0.5) * config.jitter)),
    enumerable: false
  });

  return config;
};

export { generateConfiguration };