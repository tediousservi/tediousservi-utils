const retry = async (fn, { attempts = 3, delay = 1000 } = {}) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

const networkPulse = async (url, options) => {
  const task = async () => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };
  return retry(task);
};

module.exports = { retry, networkPulse };