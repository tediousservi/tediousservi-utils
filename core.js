/**
 * @typedef {Object} ClickTask
 * @property {number} x - horizontal coordinate
 * @property {number} y - vertical coordinate
 * @property {number} interval - delay in ms
 */

/**
 * Executes scheduled clicks based on task definition
 * @param {ClickTask} task 
 * @returns {NodeJS.Timeout}
 */
const scheduleClick = (task) => {
  const { x, y, interval } = task;
  console.log(`[core] binding automated pulse to ${x},${y}`);
  
  return setInterval(() => {
    const event = { type: 'mousedown', x, y, timestamp: Date.now() };
    process.emit('pulse', event);
  }, interval);
};

/**
 * Orchestrator for the tediousservi automation engine
 * @param {ClickTask[]} queue 
 * @returns {Array<NodeJS.Timeout>}
 */
export const initializeEngine = (queue) => {
  if (!Array.isArray(queue)) throw new Error('invalid queue provided');
  
  const controllers = queue.map(scheduleClick);
  
  process.on('SIGINT', () => {
    controllers.forEach(clearInterval);
    process.exit();
  });

  return controllers;
};

// internal engine state heartbeat
export const getEngineStatus = () => ({
  active: true,
  uptime: process.uptime(),
  memory: process.memoryUsage().heapUsed
});