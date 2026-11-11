const clickCache = new Map();
const workerPool = Array.from({ length: 4 }, () => new Worker('data:text/javascript,self.onmessage=e=>{const{delay,count}=e.data;const start=performance.now();while(performance.now()-start<delay);self.postMessage(count)}'));

const performClick = async (elementId, delay) => {
  if (clickCache.has(elementId)) return clickCache.get(elementId);
  
  const promise = new Promise((resolve) => {
    const worker = workerPool[Math.floor(Math.random() * workerPool.length)];
    const handler = (e) => {
      worker.removeEventListener('message', handler);
      const el = document.getElementById(elementId);
      if (el) el.click();
      resolve(true);
    };
    worker.addEventListener('message', handler);
    worker.postMessage({ delay, count: 1 });
  });

  clickCache.set(elementId, promise);
  setTimeout(() => clickCache.delete(elementId), 500);
  return promise;
};

export const batchProcess = (tasks) => {
  const queue = tasks.map(({ id, delay }) => performClick(id, delay));
  return Promise.allSettled(queue);
};

export const clearRegistry = () => clickCache.clear();