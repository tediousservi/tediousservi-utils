const fs = require('fs');
const path = require('path');

const defaults = {
  interval: 100,
  jitter: 0.15,
  button: 'left',
  safetyKey: 'F12',
  headless: false
};

const merge = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) Object.assign(source[key], merge(target[key], source[key]));
  }
  return { ...target, ...source };
};

const loadConfig = (configPath = 'settings.json') => {
  try {
    const fullPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(fullPath)) return defaults;
    const userConfig = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    return merge(defaults, userConfig);
  } catch (err) {
    process.emitWarning('Failed to load config, falling back to safe defaults');
    return defaults;
  }
};

module.exports = { loadConfig };