const executeWithRetry = async (fn, attempts = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
};

const wrapNetworkCall = (func) => {
  return (...args) => {
    console.log(`[tediousservi-utils] attempting network operation...`);
    return executeWithRetry(() => func(...args));
  };
};

module.exports = { executeWithRetry, wrapNetworkCall };