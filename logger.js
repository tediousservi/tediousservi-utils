const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 1024 * 512;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = (filePath) => {
  const timestamp = Date.now();
  fs.renameSync(filePath, `${filePath}.${timestamp}.old`);
};

const logger = (message) => {
  const logPath = path.join(LOG_DIR, 'clicker.log');
  const entry = `[${new Date().toISOString()}] ${message}\n`;

  try {
    if (fs.existsSync(logPath) && fs.statSync(logPath).size > MAX_SIZE) {
      rotate(logPath);
    }
    fs.appendFileSync(logPath, entry);
  } catch (err) {
    process.stderr.write(`Logger failure: ${err.message}\n`);
  }
};

module.exports = { logger };