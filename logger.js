const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'tediousservi.log');

const safeWrite = (data) => {
  try {
    const entry = `[${new Date().toISOString()}] ${data}\n`;
    fs.appendFileSync(logFilePath, entry, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(logFilePath, `[INITIALIZED] ${data}\n`);
    } else {
      console.error('CRITICAL_LOG_FAILURE:', err.message);
    }
  }
};

const logger = {
  info: (msg) => safeWrite(`INFO: ${msg}`),
  warn: (msg) => safeWrite(`WARN: ${msg}`),
  error: (err) => {
    const details = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
    safeWrite(`FATAL: ${details}`);
  },
  // Catch-all for edge case failures in the clicker loop
  handleUnexpected: (ctx, err) => {
    const payload = JSON.stringify({ ctx, error: err.message, timestamp: Date.now() });
    safeWrite(`EDGE_CASE_TRAP: ${payload}`);
    if (process.env.DEBUG_MODE) process.exit(1);
  }
};

module.exports = logger;