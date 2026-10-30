const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'clicker.log');
const stream = fs.createWriteStream(logPath, { flags: 'a' });

const format = (lvl, msg) => {
  const ts = new Date().toISOString().replace(/T/, ' ').replace(/Z/, '');
  return `[${ts}] [${lvl.toUpperCase()}]: ${msg}\n`;
};

const logger = {
  info: (msg) => {
    const line = format('info', msg);
    process.stdout.write(line);
    stream.write(line);
  },
  error: (msg) => {
    const line = format('error', msg);
    process.stderr.write(`\x1b[31m${line}\x1b[0m`);
    stream.write(line);
  },
  debug: (msg) => {
    if (process.env.DEBUG) {
      stream.write(format('debug', msg));
    }
  },
  cleanup: () => {
    stream.end();
  }
};

process.on('exit', logger.cleanup);

module.exports = logger;