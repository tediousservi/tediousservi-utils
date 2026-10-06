const workerPool = new SharedArrayBuffer(1024);
const state = new Int32Array(workerPool);

const tick = (interval, task) => {
  let last = performance.now();
  const loop = (now) => {
    if (now - last >= interval) {
      task();
      last = now;
    }
    state[0] = requestAnimationFrame(loop);
  };
  state[0] = requestAnimationFrame(loop);
};

const batchClick = (targets, intensity) => {
  const now = Date.now();
  for (let i = 0; i < targets.length; i++) {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: targets[i].x,
      clientY: targets[i].y
    });
    targets[i].element.dispatchEvent(event);
  }
  return Date.now() - now;
};

export const initEngine = (targets, hz = 60) => {
  const interval = 1000 / hz;
  tick(interval, () => batchClick(targets, 1));
};

export const stopEngine = () => {
  cancelAnimationFrame(state[0]);
};

export default { initEngine, stopEngine };