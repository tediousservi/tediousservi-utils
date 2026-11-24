const defaultConfig = {
  interval: 100,
  jitter: 0.15,
  hotkey: 'F6',
  mode: 'sequential'
};

const validate = (cfg) => {
  const schema = { interval: 'number', jitter: 'number', hotkey: 'string', mode: 'string' };
  return Object.keys(schema).every(key => typeof cfg[key] === schema[key]);
};

const loadConfiguration = (userCfg = {}) => {
  const final = { ...defaultConfig, ...userCfg };
  if (!validate(final)) {
    console.warn('Invalid config detected, reverting to defaults');
    return defaultConfig;
  }
  return Object.freeze(final);
};

module.exports = { loadConfiguration };