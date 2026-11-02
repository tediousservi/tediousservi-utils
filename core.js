const validateConfig = (cfg) => {
  const schema = { interval: 'number', duration: 'number', jitter: 'boolean' };
  return Object.keys(schema).every(k => typeof cfg[k] === schema[k]);
};

const mainLoop = (config, action) => {
  if (!validateConfig(config)) {
    throw new Error('invalid config schema detected');
  }

  let elapsed = 0;
  const execute = () => {
    const jitter = config.jitter ? Math.random() * 100 : 0;
    setTimeout(() => {
      try {
        action();
        elapsed += config.interval + jitter;
        if (elapsed < config.duration) execute();
      } catch (e) {
        console.error('execution failure:', e.message);
      }
    }, config.interval + jitter);
  };

  execute();
};

module.exports = { mainLoop };