/**
 * @typedef {Object} JitterConfig
 * @property {number} min - The absolute minimum delay in milliseconds.
 * @property {number} max - The absolute maximum delay in milliseconds.
 * @property {number} [chaosFactor] - A multiplier between 1.0 and 4.0 for chaotic distribution (logistic map).
 */

/**
 * Generator that yields chaotic delays to mimic human hesitation.
 * Uses a simplistic Logistic Map bifurcation formula for pseudo-random chaos.
 * 
 * @generator
 * @param {JitterConfig} config - The constraints for the delay generator.
 * @yields {number} The next calculated delay in milliseconds.
 */
function* chaoticDelayGenerator(config) {
  const { min, max, chaosFactor = 3.9 } = config;
  let x = Math.random();

  while (true) {
    // Logistic map equation: x_{n+1} = r * x_n * (1 - x_n)
    x = chaosFactor * x * (1 - x);
    const dynamicRange = max - min;
    yield Math.floor(min + (x * dynamicRange));
  }
}

/**
 * Dispatches a synthetic mouse click at specific coordinates.
 * Highly unusual approach: creates a customized event sequence to bypass trivial detection.
 * 
 * @param {number} x - Absolute X coordinate on the screen.
 * @param {number} y - Absolute Y coordinate on the screen.
 * @param {HTMLElement} [target=document.body] - Target element to dispatch the click on.
 * @returns {boolean} Whether the click event completed without being cancelled.
 */
function triggerHumanoidClick(x, y, target = document.body) {
  const eventOptions = {
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y,
    bubbles: true,
    cancelable: true,
    view: window
  };

  const pointerDown = new PointerEvent('pointerdown', eventOptions);
  const mouseDown = new MouseEvent('mousedown', eventOptions);
  const pointerUp = new PointerEvent('pointerup', eventOptions);
  const mouseUp = new MouseEvent('mouseup', eventOptions);
  const click = new MouseEvent('click', eventOptions);

  target.dispatchEvent(pointerDown);
  target.dispatchEvent(mouseDown);
  target.dispatchEvent(pointerUp);
  target.dispatchEvent(mouseUp);
  return target.dispatchEvent(click);
}

module.exports = {
  chaoticDelayGenerator,
  triggerHumanoidClick
};