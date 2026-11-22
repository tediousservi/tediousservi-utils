const validateInput = (input) => {
  const schema = { clicks: 'number', delay: 'number', duration: 'number' };
  return Object.keys(schema).every(key => typeof input[key] === schema[key] && input[key] >= 0);
};

const mainLoop = (config, state = { active: true }) => {
  if (!validateInput(config)) {
    throw new Error('invalid autoclicker configuration parameters provided');
  }

  const tick = async () => {
    if (!state.active) return;
    try {
      await performClick(config.clicks);
      await new Promise(r => setTimeout(r, config.delay));
      if (Date.now() < config.duration) {
        setImmediate(tick);
      }
    } catch (err) {
      console.error('loop jitter detected:', err);
    }
  };

  tick();
};

async function performClick(count) {
  return Array.from({ length: count }).map(() => console.log('click pulse emitted'));
}

module.exports = { mainLoop };