const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 1024 * 512;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const getLogPath = () => path.join(LOG_DIR, 'clicker.log');

const rotate = () => {
  const p = getLogPath();
  if (fs.existsSync(p) && fs.statSync(p).size > MAX_SIZE) {
    const backup = path.join(LOG_DIR, `clicker-${Date.now()}.log.bak`);
    fs.renameSync(p, backup);
  }
};

const logger = {
  info: (msg) => {
    rotate();
    const entry = `[${new Date().toISOString()}] INFO: ${msg}\n`;
    fs.appendFileSync(getLogPath(), entry);
  },
  error: (msg) => {
    rotate();
    const entry = `[${new Date().toISOString()}] ERROR: ${msg}\n`;
    fs.appendFileSync(getLogPath(), entry);
  }
};

module.exports = logger;