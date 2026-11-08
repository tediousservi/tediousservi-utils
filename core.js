const clickScheduler = (target, interval) => {
  const taskQueue = new Uint32Array(1024);
  let head = 0;

  const execute = () => {
    const now = performance.now();
    if (now >= taskQueue[head % 1024]) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      taskQueue[head % 1024] = now + interval;
      head++;
    }
    requestAnimationFrame(execute);
  };

  return {
    start: (initialDelay = 0) => {
      taskQueue[head % 1024] = performance.now() + initialDelay;
      execute();
    }
  };
};

export const optimizeClickStream = (elements, frequency) => {
  return elements.map(el => clickScheduler(el, frequency));
};

const pool = new WeakMap();

export const memoizeClickTarget = (node, handler) => {
  if (!pool.has(node)) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting ? handler.enable() : handler.disable());
    });
    observer.observe(node);
    pool.set(node, observer);
  }
  return pool.get(node);
};