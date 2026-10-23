const workerPool = new Map();
const executeClick = (target, interval) => {
  const now = performance.now();
  if (workerPool.has(target)) return;
  
  const cycle = () => {
    const active = workerPool.get(target);
    if (!active) return;
    active.last = performance.now();
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    active.timer = setTimeout(cycle, interval);
  };

  workerPool.set(target, { last: now, timer: setTimeout(cycle, interval) });
};

const stopClick = (target) => {
  const worker = workerPool.get(target);
  if (worker) {
    clearTimeout(worker.timer);
    workerPool.delete(target);
  }
};

const batchProcess = (targets, delay) => {
  let i = 0;
  const processor = () => {
    if (i < targets.length) {
      executeClick(targets[i++], delay);
      requestAnimationFrame(processor);
    }
  };
  processor();
};

export { executeClick, stopClick, batchProcess };