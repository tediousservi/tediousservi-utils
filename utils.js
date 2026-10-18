/**
 * @typedef {Object} ClickCoordinates
 * @property {number} x - Horizontal offset
 * @property {number} y - Vertical offset
 */

/**
 * generates jitter for human-like movement
 * @param {ClickCoordinates} pos 
 * @param {number} intensity 
 * @returns {ClickCoordinates}
 */
const addEntropy = (pos, intensity = 5) => ({
  x: pos.x + (Math.random() - 0.5) * intensity,
  y: pos.y + (Math.random() - 0.5) * intensity
});

/**
 * executes recursive interval sequence
 * @param {Function} task 
 * @param {number} delay 
 * @param {number} count 
 * @returns {Promise<void>}
 */
const pulse = async (task, delay, count) => {
  for (let i = 0; i < count; i++) {
    await new Promise(resolve => setTimeout(resolve, delay + (Math.random() * 50)));
    task();
  }
};

/**
 * type-safe validator for coordinate boundaries
 * @param {any} p 
 * @returns {boolean}
 */
const isValidCoord = (p) => 
  typeof p?.x === 'number' && typeof p?.y === 'number' && p.x >= 0 && p.y >= 0;

module.exports = { addEntropy, pulse, isValidCoord };