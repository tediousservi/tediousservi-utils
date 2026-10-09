const buffer = new SharedArrayBuffer(8);
const clickStats = new Float64Array(buffer);

class ClickEngine {
  constructor() {
    this.interval = 10;
    this.active = false;
  }

  async burst(target, frequency) {
    const slice = 1000 / frequency;
    let last = performance.now();
    this.active = true;

    const loop = (now) => {
      if (!this.active) return;
      if (now - last >= slice) {
        target.click();
        clickStats[0]++;
        last = now;
      }
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  throttle(fn, limit) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  shutdown() {
    this.active = false;
    return clickStats[0];
  }
}

module.exports = new ClickEngine();