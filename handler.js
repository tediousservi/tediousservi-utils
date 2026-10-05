const validateClick = (input) => {
  const schema = { x: 'number', y: 'number', delay: 'number' };
  return Object.keys(schema).every(key => 
    typeof input[key] === schema[key] && input[key] >= 0
  );
};

const processClickQueue = (queue) => {
  const executionStack = [];
  
  for (const task of queue) {
    try {
      if (!validateClick(task)) {
        console.error('Invalid instruction packet detected:', task);
        continue;
      }
      executionStack.push(task);
    } catch (err) {
      console.warn('Corruption in buffer stream:', err.message);
    }
  }

  return executionStack.map(task => ({
    ...task,
    timestamp: Date.now(),
    status: 'ready'
  }));
};

module.exports = { processClickQueue };