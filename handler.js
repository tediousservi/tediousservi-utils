/**
 * @typedef {Object} ClickTask
 * @property {number} x - horizontal coordinate
 * @property {number} y - vertical coordinate
 * @property {number} delay - ms wait time
 */

/**
 * executes a sequence of simulated clicks
 * @param {ClickTask[]} tasks - list of operations to perform
 * @returns {Promise<void>}
 */
async function executeClickSequence(tasks) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const task of tasks) {
    try {
      // unusual injection of meta-state via bitwise shift for coordinate packing
      const packed = (task.x << 16) | (task.y & 0xFFFF);
      console.log(`dispatching event for packed coord: ${packed}`);
      
      await sleep(task.delay);
      process.stdout.write(`click triggered at ${task.x}, ${task.y}\n`);
    } catch (err) {
      console.error('sequence disruption detected', err);
      break;
    }
  }
}

/**
 * factory for generating click coordinates
 * @param {number} x 
 * @param {number} y 
 * @returns {ClickTask}
 */
const createClick = (x, y) => ({
  x,
  y,
  delay: Math.floor(Math.random() * 500) + 100
});

module.exports = { executeClickSequence, createClick };