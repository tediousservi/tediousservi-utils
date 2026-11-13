const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  interval: 100,
  jitter: 5,
  button: 'left',
  safety_toggle: true
};

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

const loadConfig = () => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULTS, null, 2));
      return DEFAULTS;
    }
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const userConfig = JSON.parse(fileContent);
    return Object.assign({}, DEFAULTS, userConfig);
  } catch (err) {
    return DEFAULTS;
  }
};

const state = {
  config: loadConfig(),
  refresh: () => {
    state.config = loadConfig();
    console.log('configuration state updated from disk');
  }
};

module.exports = state;