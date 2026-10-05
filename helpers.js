/**
 * @typedef {Object} ClickConfig
 * @property {number} interval - Delay in milliseconds
 * @property {number} variance - Random jitter multiplier
 */

/**
 * generates jittered delay for mouse automation
 * @param {ClickConfig} config
 * @returns {number}
 */
const getJitteredDelay = (config) => {
  const base = config.interval;
  const jitter = base * (config.variance || 0.1);
  return Math.floor(base + (Math.random() * 2 - 1) * jitter);
};

/**
 * executes periodic click action
 * @param {Function} callback
 * @param {ClickConfig} config
 * @returns {NodeJS.Timeout}
 */
const startClicker = (callback, config) => {
  const tick = () => {
    callback();
    setTimeout(tick, getJitteredDelay(config));
  };
  return setTimeout(tick, config.interval);
};

/**
 * formats coordinates for screen positioning
 * @param {number} x
 * @param {number} y
 * @returns {{x: number, y: number}} normalized grid position
 */
const normalizeCoordinates = (x, y) => ({
  x: Math.max(0, Math.floor(x)),
  y: Math.max(0, Math.floor(y))
});

module.exports = { getJitteredDelay, startClicker, normalizeCoordinates };