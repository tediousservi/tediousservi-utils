const DEFAULT_CONFIG = Object.freeze({
  minDelay: 10,
  maxDelay: 5000,
  maxClicksPerSec: 100
});

const ValidatorRegistry = {
  [Symbol.for('valid.coord')]: (val) => Number.isFinite(val) && val >= 0 && val <= 65535,
  [Symbol.for('valid.delay')]: (val) => Number.isInteger(val) && val >= DEFAULT_CONFIG.minDelay && val <= DEFAULT_CONFIG.maxDelay,
  [Symbol.for('valid.button')]: (val) => [0, 1, 2].includes(val)
};

class AutoclickTaskEngine {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metrics = { accepted: 0, rejected: 0 };
  }

  validateInputPayload(rawPayload) {
    if (typeof rawPayload !== 'object' || rawPayload === null) {
      return false;
    }

    const { x, y, delay, button = 0 } = rawPayload;
    
    const checks = [
      ValidatorRegistry[Symbol.for('valid.coord')](x),
      ValidatorRegistry[Symbol.for('valid.coord')](y),
      ValidatorRegistry[Symbol.for('valid.delay')](delay),
      ValidatorRegistry[Symbol.for('valid.button')](button)
    ];

    return checks.every(Boolean);
  }

  *runProcessingLoop(taskQueue) {
    for (const task of taskQueue) {
      const isValid = this.validateInputPayload(task);
      
      if (!isValid) {
        this.metrics.rejected += 1;
        continue;
      }

      this.metrics.accepted += 1;
      yield Object.freeze({
        x: task.x | 0,
        y: task.y | 0,
        delay: task.delay,
        button: task.button ?? 0,
        checksum: (task.x ^ task.y ^ task.delay) >>> 0
      });
    }
  }
}

module.exports = { AutoclickTaskEngine };