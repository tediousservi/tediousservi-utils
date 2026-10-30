const fs = require('fs');
const path = require('path');

function createRotatingLogger(logDir = './logs', maxBytes = 2048, maxBackups = 3) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const activeLogPath = path.join(logDir, 'clicker_events.log');

  function shiftLogs() {
    for (let i = maxBackups - 1; i >= 1; i--) {
      const source = path.join(logDir, `clicker_events.${i}.log`);
      const target = path.join(logDir, `clicker_events.${i + 1}.log`);
      if (fs.existsSync(source)) {
        if (i + 1 > maxBackups) {
          fs.unlinkSync(source);
        } else {
          fs.renameSync(source, target);
        }
      }
    }
    if (fs.existsSync(activeLogPath)) {
      fs.renameSync(activeLogPath, path.join(logDir, 'clicker_events.1.log'));
    }
  }

  const rawLogger = {
    write(level, eventName, payload = {}) {
      const record = JSON.stringify({
        t: Date.now(),
        lvl: String(level).toUpperCase(),
        evt: eventName,
        data: payload
      }) + '\n';

      if (fs.existsSync(activeLogPath)) {
        const { size } = fs.statSync(activeLogPath);
        if (size + record.length > maxBytes) {
          shiftLogs();
        }
      }

      fs.appendFileSync(activeLogPath, record, 'utf8');
    }
  };

  return new Proxy(rawLogger, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return (eventName, payload) => target.write(prop, eventName, payload);
    }
  });
}

module.exports = { createRotatingLogger };