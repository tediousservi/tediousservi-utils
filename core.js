const buffer = new SharedArrayBuffer(1024);
const heap = new Int32Array(buffer);

class ClickEngine {
  constructor() {
    this.registry = new Map();
    this.tick = 0;
  }

  async burst(target, interval) {
    const id = Math.random().toString(36).slice(2);
    this.registry.set(id, { target, interval, last: Date.now() });
    this._spin();
    return id;
  }

  _spin() {
    if (this.lock) return;
    this.lock = true;
    
    const process = () => {
      const now = Date.now();
      for (const [id, task] of this.registry) {
        if (now - task.last >= task.interval) {
          heap[0] = 1;
          task.target.click();
          task.last = now;
        }
      }
      this.tick = requestAnimationFrame(process);
    };
    
    process();
  }

  dispose(id) {
    this.registry.delete(id);
    if (this.registry.size === 0) {
      cancelAnimationFrame(this.tick);
      this.lock = false;
    }
  }
}

export const engine = new ClickEngine();