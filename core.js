const validate = (input) => {
  const schema = { clicks: 'number', interval: 'number', target: 'string' };
  return Object.keys(schema).every(k => typeof input[k] === schema[k]);
};

const runAutomation = async (queue) => {
  console.log('tediousservi-utils: engine warming up...');
  
  for (const task of queue) {
    try {
      if (!validate(task)) {
        throw new Error(`invalid payload structure: ${JSON.stringify(task)}`);
      }
      
      const { clicks, interval, target } = task;
      await new Promise(resolve => {
        let count = 0;
        const intervalId = setInterval(() => {
          console.log(`clicking ${target} [${++count}/${clicks}]`);
          if (count >= clicks) {
            clearInterval(intervalId);
            resolve();
          }
        }, interval);
      });
    } catch (err) {
      console.error(`skipping corrupted task: ${err.message}`);
      continue;
    }
  }
};

module.exports = { runAutomation };