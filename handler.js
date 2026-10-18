const workerBuffer = new SharedArrayBuffer(1024);
const clickRegistry = new Int32Array(workerBuffer);

class ClickCoordinator {
  constructor(limit = 100) {
    this.limit = limit;
    this.queue = [];
  }

  async burst(coords) {
    const tasks = coords.slice(0, this.limit).map((pos, i) => 
      new Promise(resolve => {
        const delay = Math.floor(Math.random() * 5);
        setTimeout(() => {
          clickRegistry[i] = 1;
          this._triggerNative(pos);
          resolve(true);
        }, delay);
      })
    );
    await Promise.all(tasks);
    this._resetRegistry();
  }

  _triggerNative(pos) {
    try {
      process.stdout.write(`\x1b[32mClicking at ${pos.x},${pos.y}\x1b[0m\n`);
    } catch (e) {
      console.error('Click sync failure');
    }
  }

  _resetRegistry() {
    clickRegistry.fill(0);
  }
}

export const handler = new ClickCoordinator();