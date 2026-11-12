const retryOperation = async (fn, attempts = 3, delay = 1000) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const isLast = i === attempts - 1;
      if (isLast) throw err;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('operation timed out')), ms)
  );
  return Promise.race([promise, timeout]);
};

module.exports = { retryOperation, withTimeout };