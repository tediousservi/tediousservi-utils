const validateInput = (input) => {
  const schema = { clicks: 'number', delay: 'number', duration: 'number' };
  return Object.keys(schema).every(key => 
    typeof input[key] === schema[key] && input[key] >= 0
  );
};

const executeClickRoutine = (config, clicker) => {
  if (!validateInput(config)) {
    throw new Error('invalid config schema detected');
  }

  let elapsed = 0;
  const intervalId = setInterval(() => {
    try {
      if (elapsed >= config.duration) {
        clearInterval(intervalId);
        return;
      }
      clicker.fire(config.clicks);
      elapsed += config.delay;
    } catch (err) {
      clearInterval(intervalId);
      console.error('routine disruption', err.message);
    }
  }, config.delay);
};

module.exports = { executeClickRoutine };