const fs = require('fs');
const path = require('path');

const LOG_DIR = './logs';
const MAX_SIZE = 1024 * 512;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = (filePath) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.renameSync(filePath, `${filePath}.${timestamp}.old`);
};

const logger = (message) => {
  const logPath = path.join(LOG_DIR, 'clicker.log');
  
  if (fs.existsSync(logPath) && fs.statSync(logPath).size > MAX_SIZE) {
    rotate(logPath);
  }

  const entry = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(entry);
  fs.appendFileSync(logPath, entry);
};

module.exports = logger;