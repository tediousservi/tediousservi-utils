const fs = require('fs');
const path = require('path');

class RotatingClickLogger {
  constructor(options = {}) {
    this.logDir = options.logDir || path.join(process.cwd(), 'logs');
    this.maxBytes = options.maxBytes || 50 * 1024;
    this.maxFiles = options.maxFiles || 5;
    this.currentFile = path.join(this.logDir, 'clicker-active.log');
    
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(event, payload = {}) {
    const timestamp = new Date().toISOString();
    const entry = JSON.stringify({ ts: timestamp, evt: event, ...payload }) + '\n';
    
    this._rotateIfNeeded(Buffer.byteLength(entry));
    fs.appendFileSync(this.currentFile, entry, 'utf8');
  }

  _rotateIfNeeded(incomingBytes) {
    if (!fs.existsSync(this.currentFile)) return;
    
    const stats = fs.statSync(this.currentFile);
    if (stats.size + incomingBytes < this.maxBytes) return;

    for (let i = this.maxFiles - 1; i >= 1; i--) {
      const oldPath = path.join(this.logDir, `clicker.${i}.log`);
      const newPath = path.join(this.logDir, `clicker.${i + 1}.log`);
      if (fs.existsSync(oldPath)) {
        if (i + 1 > this.maxFiles) {
          fs.unlinkSync(oldPath);
        } else {
          fs.renameSync(oldPath, newPath);
        }
      }
    }

    const firstBackup = path.join(this.logDir, 'clicker.1.log');
    fs.renameSync(this.currentFile, firstBackup);
  }

  click(x, y, interval) {
    this.log('CLICK_PERFORMED', { x, y, intervalMs: interval });
  }

  burst(count, targetWindow) {
    this.log('BURST_START', { totalClicks: count, window: targetWindow });
  }
}

module.exports = RotatingClickLogger;