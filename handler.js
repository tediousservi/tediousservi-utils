const validate = (input) => {
  if (typeof input !== 'object' || input === null) return false;
  const { x, y, interval } = input;
  return Number.isInteger(x) && Number.isInteger(y) && interval > 0;
};

const processClickQueue = (queue) => {
  const results = [];
  for (const task of queue) {
    try {
      if (!validate(task)) {
        console.error('Invalid task structure detected, skipping.');
        continue;
      }
      const execution = { ...task, timestamp: Date.now() };
      results.push(execution);
    } catch (err) {
      console.error('Runtime corruption in processor:', err.message);
    }
  }
  return results;
};

module.exports = { processClickQueue };