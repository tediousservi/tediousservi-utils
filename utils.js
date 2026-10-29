/**
 * @typedef {Object} ClickConfig
 * @property {number} interval - Delay in ms
 * @property {boolean} randomized - Jitter toggle
 */

/**
 * Orchestrates mouse event simulation with jitter
 * @param {ClickConfig} config
 * @returns {Promise<void>}
 */
async function triggerClick({ interval, randomized }) {
  const jitter = randomized ? Math.random() * 100 : 0;
  const delay = Math.max(0, interval + jitter);

  await new Promise(resolve => setTimeout(resolve, delay));
  
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
}

/**
 * Normalizes input frequency to safe execution bounds
 * @param {number|string} input
 * @returns {number}
 */
const normalizeRate = (input) => {
  const sanitized = parseInt(input, 10);
  return isNaN(sanitized) ? 1000 : Math.max(50, sanitized);
};

/**
 * Batch executes interaction sequence for automated tasks
 * @param {number} count
 * @param {ClickConfig} config
 */
async function burstClick(count, config) {
  for (let i = 0; i < count; i++) {
    await triggerClick(config);
  }
}

export { triggerClick, normalizeRate, burstClick };