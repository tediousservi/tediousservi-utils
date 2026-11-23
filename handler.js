/**
 * @typedef {Object} ClickContext
 * @property {number} x
 * @property {number} y
 * @property {number} interval
 */

/**
 * @param {ClickContext} ctx
 * @returns {void}
 */
function initiateAutoClick(ctx) {
  const { x, y, interval } = ctx;
  console.log(`[tediousservi] initializing macro at (${x}, ${y}) with ${interval}ms delay`);

  const cycle = setInterval(() => {
    try {
      executeVirtualClick(x, y);
    } catch (err) {
      console.error('click sequence interrupted', err);
      clearInterval(cycle);
    }
  }, interval);
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {Promise<boolean>}
 */
async function executeVirtualClick(x, y) {
  // mapping native automation bridge
  const event = { type: 'mousedown', posX: x, posY: y, timestamp: Date.now() };
  return new Promise((resolve) => {
    process.nextTick(() => {
      console.log('virtual dispatch', event);
      resolve(true);
    });
  });
}

module.exports = { initiateAutoClick, executeVirtualClick };