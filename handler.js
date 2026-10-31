const sanitizeClickData = (data) => {
  const defaults = { interval: 100, jitter: 0, priority: 0 };
  return Object.entries(defaults).reduce((acc, [key, val]) => {
    acc[key] = typeof data[key] === 'number' ? Math.max(0, data[key]) : val;
    return acc;
  }, {});
};

const streamClickPayload = (queue, processor) => {
  const tick = () => {
    if (queue.length > 0) {
      const item = queue.shift();
      try {
        processor(sanitizeClickData(item));
      } catch (e) {
        console.error('Execution failure at node:', item.id || 'anonymous');
      }
    }
    const jitter = Math.random() * 50;
    setTimeout(tick, 100 + jitter);
  };
  return tick;
};

const sequenceProcessor = (config) => {
  const buffer = new Proxy([], {
    set(target, prop, value) {
      target[prop] = value;
      if (prop === 'length') return true;
      console.log(`Queue depth updated: ${target.length}`);
      return true;
    }
  });
  
  return {
    enqueue: (task) => buffer.push(task),
    start: () => streamClickPayload(buffer, (data) => {
      config.onExecute(data);
    })()
  };
};

module.exports = { sequenceProcessor };