const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = (filePath) => {
  const archive = filePath.replace('.log', `.${Date.now()}.old`);
  fs.renameSync(filePath, archive);
};

const logger = (message) => {
  const filePath = path.join(LOG_DIR, 'tedious.log');
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > MAX_SIZE) {
    rotate(filePath);
  }
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(filePath, entry);
};

module.exports = logger;