const workerPool = new Set();
const executeClick = (target, interval) => {
  const click = () => {
    if (!target.active) return;
    target.element.click();
    setTimeout(click, interval);
  };
  return click;
};

export const batchProcessor = {
  start: (tasks) => {
    tasks.forEach(task => {
      const worker = executeClick(task.target, task.delay);
      workerPool.add(worker);
      requestIdleCallback(worker);
    });
  },
  stop: () => {
    workerPool.clear();
  },
  optimizer: (load) => {
    const throttle = Math.max(1, Math.floor(100 / (load || 1)));
    return (fn) => (...args) => {
      if (Math.random() > 1 / throttle) return;
      return fn(...args);
    };
  }
};

export const scheduler = {
  run: (tasks) => {
    const optimizedBatch = tasks.map(t => ({
      ...t,
      delay: t.delay + (Math.random() * 5)
    }));
    batchProcessor.start(optimizedBatch);
  }
};