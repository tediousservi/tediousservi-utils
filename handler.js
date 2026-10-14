const eventPool = new Map();
const RECYCLE_THRESHOLD = 5000;

class ClickCoordinator {
  constructor() {
    this.buffer = new Float64Array(1024);
    this.pointer = 0;
  }

  execute(task) {
    if (this.pointer >= this.buffer.length) this.flush();
    this.buffer[this.pointer++] = performance.now();
    
    const key = task.id || Symbol('task');
    const cached = eventPool.get(key);

    if (cached) {
      cached.apply(task.data);
    } else {
      const runner = new Function('d', `return ${task.logic}`);
      eventPool.set(key, runner);
      runner(task.data);
    }

    if (eventPool.size > RECYCLE_THRESHOLD) {
      eventPool.clear();
    }
  }

  flush() {
    this.buffer.fill(0);
    this.pointer = 0;
  }
}

export const handler = new ClickCoordinator();