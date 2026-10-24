const validateClickSequence = (coords) => {
  const isValid = Array.isArray(coords) && coords.every(c => 
    typeof c.x === 'number' && 
    typeof c.y === 'number' && 
    c.x >= 0 && c.y >= 0
  );
  if (!isValid) throw new Error('invalid sequence geometry detected');
  return true;
};

const processClickLoop = (queue, executionFn) => {
  let tick = 0;
  return async () => {
    try {
      const batch = queue.splice(0, 10);
      if (batch.length === 0) return;
      
      validateClickSequence(batch);
      
      for (const step of batch) {
        await executionFn(step);
        tick++;
      }
    } catch (err) {
      console.error(`sequence disruption at tick ${tick}:`, err.message);
      process.emit('SIGINT');
    }
  };
};

module.exports = { processClickLoop };