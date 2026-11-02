const { performance } = require('perf_hooks');

class FastClickLoop {
  constructor(capacity = 2048) {
    this.capacity = capacity;
    this.timeQueue = new Float64Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.active = false;
    this.intervalMs = 10;
    this.dispatchFn = null;
  }

  configure(cps, callback) {
    this.intervalMs = Math.max(0.05, 1000 / (cps || 100));
    this.dispatchFn = callback;
    return this;
  }

  enqueueBurst(burstSize = 50) {
    const now = performance.now();
    for (let i = 0; i < burstSize; i++) {
      const nextHead = (this.head + 1) % this.capacity;
      if (nextHead === this.tail) break;
      this.timeQueue[this.head] = now + (i * this.intervalMs);
      this.head = nextHead;
    }
    if (!this.active) this.drain();
  }

  drain() {
    this.active = true;
    const loop = () => {
      if (!this.active) return;
      const now = performance.now();

      while (this.tail !== this.head && this.timeQueue[this.tail] <= now) {
        if (this.dispatchFn) this.dispatchFn(this.timeQueue[this.tail]);
        this.tail = (this.tail + 1) % this.capacity;
      }

      if (this.tail !== this.head) {
        const remainingTime = this.timeQueue[this.tail] - performance.now();
        if (remainingTime <= 1) {
          setImmediate(loop);
        } else {
          setTimeout(loop, Math.min(remainingTime | 0, 15));
        }
      } else {
        this.active = false;
      }
    };
    loop();
  }

  reset() {
    this.active = false;
    this.head = 0;
    this.tail = 0;
  }
}

module.exports = { FastClickLoop };