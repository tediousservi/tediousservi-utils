const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'click_history.jsonl');

const Logger = {
  entries: [],
  writeQueue: async (data) => {
    const entry = JSON.stringify({
      ts: Date.now(),
      ...data,
      meta: 'tediousservi-trace'
    }) + '\n';
    
    try {
      fs.appendFileSync(LOG_FILE, entry);
      Logger.entries.push(data);
      if (Logger.entries.length > 50) Logger.entries.shift();
    } catch (e) {
      process.stderr.write(`[CRITICAL] logging failure: ${e.message}\n`);
    }
  },
  flush: () => {
    const snapshot = [...Logger.entries];
    Logger.entries = [];
    return snapshot;
  },
  formatStats: () => {
    const total = Logger.entries.length;
    const avg = total > 0 
      ? Logger.entries.reduce((a, b) => a + (b.delay || 0), 0) / total 
      : 0;
    return { count: total, avgDelay: avg.toFixed(2) };
  }
};

module.exports = Logger;