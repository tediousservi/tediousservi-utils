const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const getLogPath = () => path.join(LOG_DIR, 'tedious.log');

const rotate = () => {
  const p = getLogPath();
  if (fs.existsSync(p) && fs.statSync(p).size > MAX_SIZE) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.renameSync(p, path.join(LOG_DIR, `tedious-${timestamp}.log`));
  }
};

const logger = {
  info: (msg) => {
    rotate();
    const entry = `[${new Date().toISOString()}] INFO: ${msg}${os.EOL}`;
    fs.appendFileSync(getLogPath(), entry);
  },
  error: (err) => {
    rotate();
    const entry = `[${new Date().toISOString()}] ERROR: ${err.stack || err}${os.EOL}`;
    fs.appendFileSync(getLogPath(), entry);
  }
};

module.exports = logger;