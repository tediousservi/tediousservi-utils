const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = (file) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.renameSync(file, `${file}.${timestamp}.old`);
};

const logger = (msg, level = 'INFO') => {
  const logFile = path.join(LOG_DIR, 'tedious.log');
  const entry = `[${new Date().toISOString()}] [${level}] ${msg}${os.EOL}`;
  
  if (fs.existsSync(logFile) && fs.statSync(logFile).size > MAX_SIZE) {
    rotate(logFile);
  }
  
  fs.appendFileSync(logFile, entry);
};

module.exports = { logger };