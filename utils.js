const validateClickSequence = (sequence) => {
  const schema = { clicks: 'number', delay: 'number', x: 'number', y: 'number' };
  return Array.isArray(sequence) && sequence.every(cmd => 
    Object.keys(schema).every(key => typeof cmd[key] === schema[key])
  );
};

const executeClickLoop = (config, actionFn) => {
  if (!validateClickSequence(config.queue)) {
    throw new Error('invalid schema detected in click stream');
  }

  let index = 0;
  const pulse = () => {
    if (index >= config.queue.length) return;
    const { clicks, delay, x, y } = config.queue[index++];
    
    Array.from({ length: clicks }).forEach(() => actionFn(x, y));
    
    setTimeout(pulse, delay || 100);
  };

  pulse();
};

module.exports = { validateClickSequence, executeClickLoop };