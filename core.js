const workerPool = new Map();
const scheduler = (task, delay) => setTimeout(task, delay);

const executeClick = (x, y) => {
  const now = performance.now();
  if (workerPool.has(`${x}:${y}`)) return;
  
  workerPool.set(`${x}:${y}`, now);
  try {
    process.stdout.write(`\x1b[32mClick @ ${x},${y}\x1b[0m\n`);
  } finally {
    setTimeout(() => workerPool.delete(`${x}:${y}`), 16);
  }
};

const optimizeEventLoop = (tasks) => {
  const batch = tasks.splice(0, 100);
  batch.forEach(({ x, y, d }) => scheduler(() => executeClick(x, y), d));
  if (tasks.length > 0) {
    setImmediate(() => optimizeEventLoop(tasks));
  }
};

module.exports = { executeClick, optimizeEventLoop };