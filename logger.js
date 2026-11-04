const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 1024 * 1024;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = (file) => {
  const timestamp = Date.now();
  fs.renameSync(file, `${file}.${timestamp}.old`);
};

const logger = (message) => {
  const logFile = path.join(LOG_DIR, 'tediousservi.log');
  const entry = `[${new Date().toISOString()}] ${message}\n`;

  if (fs.existsSync(logFile) && fs.statSync(logFile).size > MAX_SIZE) {
    rotate(logFile);
  }

  fs.appendFileSync(logFile, entry);
};

module.exports = { logger };