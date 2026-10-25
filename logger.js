const fs = require('fs');
const path = require('path');

class RotatingClickLogger {
  constructor(options = {}) {
    this.logDir = options.logDir || './click_logs';
    this.maxEntriesPerFile = options.maxEntriesPerFile || 100;
    this.maxFiles = options.maxFiles || 5;
    this.sequence = 0;
    this.fileIndex = 0;
    
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  get activeFilePath() {
    return path.join(this.logDir, `autoclick_${this.fileIndex}.jsonl`);
  }

  rotate() {
    this.sequence = 0;
    this.fileIndex = (this.fileIndex + 1) % this.maxFiles;
    const targetPath = this.activeFilePath;
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
  }

  logClick(targetElement, coordinates, delayMs) {
    this.sequence++;
    if (this.sequence > this.maxEntriesPerFile) {
      this.rotate();
    }

    const record = {
      id: `${Date.now()}-${this.sequence}`,
      timestamp: new Date().toISOString(),
      target: targetElement,
      coords: [coordinates.x, coordinates.y],
      intervalMs: delayMs
    };

    fs.appendFileSync(this.activeFilePath, JSON.stringify(record) + '\n', 'utf8');
    return record.id;
  }
}

module.exports = { RotatingClickLogger };