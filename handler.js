const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryOperation = async (fn, maxRetries = 3, backoff = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      const wait = backoff * Math.pow(2, attempt - 1);
      await delay(wait);
    }
  }
};

const executeNetworkTask = async (taskFn, taskName = 'unknown') => {
  console.log(`[tediousservi-utils] firing task: ${taskName}`);
  return await retryOperation(taskFn)
    .then((result) => {
      console.log(`[tediousservi-utils] success: ${taskName}`);
      return result;
    })
    .catch((err) => {
      console.error(`[tediousservi-utils] fatal failure in ${taskName}:`, err.message);
      throw err;
    });
};

module.exports = { executeNetworkTask };