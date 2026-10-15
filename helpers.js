const memoizeCache = new Map();

const performanceBypass = (fn, ttl = 50) => {
  return (...args) => {
    const key = JSON.stringify(args);
    if (memoizeCache.has(key)) {
      const entry = memoizeCache.get(key);
      if (Date.now() - entry.ts < ttl) return entry.val;
    }
    const val = fn(...args);
    memoizeCache.set(key, { val, ts: Date.now() });
    return val;
  };
};

const fastClickCoordinates = (x, y) => {
  const gridRes = 10;
  return { 
    qx: Math.round(x / gridRes) * gridRes, 
    qy: Math.round(y / gridRes) * gridRes 
  };
};

const batchExecute = (tasks, chunkSize = 5) => {
  return tasks.reduce((acc, _, i) => {
    if (i % chunkSize === 0) acc.push(tasks.slice(i, i + chunkSize));
    return acc;
  }, []).map(async (batch) => {
    await new Promise(resolve => setImmediate(resolve));
    return batch.map(fn => fn());
  });
};

module.exports = {
  memoize: performanceBypass,
  quantize: fastClickCoordinates,
  scheduler: batchExecute
};