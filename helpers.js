const validateClickSequence = (coords) => {
  const isValid = (c) => typeof c === 'number' && Number.isFinite(c) && c >= 0;
  return Array.isArray(coords) && coords.every(p => isValid(p.x) && isValid(p.y));
};

const sanitizeInterval = (ms) => {
  const min = 50;
  const max = 60000;
  const val = parseInt(ms, 10);
  return isNaN(val) ? min : Math.min(Math.max(val, min), max);
};

const processClickLoop = (config, action) => {
  if (!validateClickSequence(config.targets)) {
    throw new Error('Invalid coordinate array provided');
  }

  const safeInterval = sanitizeInterval(config.delay);
  let iteration = 0;

  const tick = () => {
    if (iteration >= config.limit) return;
    
    config.targets.forEach(pos => {
      action(pos.x, pos.y);
    });
    
    iteration++;
    setTimeout(tick, safeInterval);
  };

  return tick;
};

module.exports = { validateClickSequence, sanitizeInterval, processClickLoop };