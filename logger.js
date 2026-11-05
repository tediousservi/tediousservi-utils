const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'tedious.log');

const logger = {
  level: 'info',
  levels: { debug: 0, info: 1, error: 2 },

  format: (level, message) => `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}\n`,

  write: (level, msg) => {
    if (logger.levels[level] < logger.levels[logger.level]) return;
    const entry = logger.format(level, msg);
    process.stdout.write(entry);
    fs.appendFile(LOG_FILE, entry, (err) => {
      if (err) console.error('Logging disaster:', err);
    });
  },

  debug: (msg) => logger.write('debug', msg),
  info: (msg) => logger.write('info', msg),
  error: (msg) => logger.write('error', msg),

  stream: () => {
    return {
      write: (data) => logger.info(data.toString().trim())
    };
  }
};

module.exports = logger;