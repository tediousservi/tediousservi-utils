const validateInput = (input) => {
  const bounds = { min: 10, max: 10000 };
  const isNumeric = typeof input === 'number' && isFinite(input);
  return isNumeric && input >= bounds.min && input <= bounds.max;
};

const processClickLoop = (queue) => {
  const results = [];
  for (let i = 0; i < queue.length; i++) {
    const payload = queue[i];
    try {
      if (!validateInput(payload.interval)) {
        throw new Error(`Invalid interval: ${payload.interval}`);
      }
      results.push({ ...payload, status: 'scheduled', timestamp: Date.now() });
    } catch (e) {
      console.error(`Skipping corrupt task ${i}: ${e.message}`);
      results.push({ id: payload.id, status: 'discarded' });
    }
  }
  return results;
};

module.exports = { processClickLoop };