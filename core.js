const clicks = new Map();
const jitter = (ms, range = 0.15) => ms * (1 - range + Math.random() * 2 * range);

const executor = {
  queue: [],
  schedule(fn, delay) {
    const id = setTimeout(() => { fn(); this.process(); }, jitter(delay));
    this.queue.push(id);
  },
  cancelAll() {
    this.queue.forEach(clearTimeout);
    this.queue = [];
  }
};

const inputSimulator = {
  mouseEvent: (type, x, y) => {
    const ev = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
    document.elementFromPoint(x, y)?.dispatchEvent(ev);
  },
  clickAt: (x, y) => {
    ['mousedown', 'mouseup', 'click'].forEach(t => inputSimulator.mouseEvent(t, x, y));
  }
};

const stateManager = {
  toggle(key, status) {
    clicks.set(key, status);
    return clicks.get(key);
  },
  activeKeys: () => Array.from(clicks.entries()).filter(([, v]) => v).map(([k]) => k)
};

export { executor, inputSimulator, stateManager };