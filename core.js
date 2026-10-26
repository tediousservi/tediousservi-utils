class OptimizedClickEngine {
  constructor(maxQueueSize = 1024) {
    this.capacity = 1 << (32 - Math.clz32(maxQueueSize - 1));
    this.mask = this.capacity - 1;
    this.timestamps = new Float64Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.active = false;
    this.rafId = null;
  }

  schedule(delayMs) {
    const targetTime = performance.now() + delayMs;
    const nextHead = (this.head + 1) & this.mask;
    if (nextHead === this.tail) return false;
    this.timestamps[this.head] = targetTime;
    this.head = nextHead;
    return true;
  }

  start(dispatchCallback) {
    if (this.active) return;
    this.active = true;

    const tick = () => {
      if (!this.active) return;
      const now = performance.now();

      while (this.tail !== this.head) {
        if (this.timestamps[this.tail] <= now) {
          dispatchCallback(now);
          this.tail = (this.tail + 1) & this.mask;
        } else {
          break;
        }
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    this.active = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.head = 0;
    this.tail = 0;
  }
}

module.exports = { OptimizedClickEngine };