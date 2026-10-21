const ErrorRegistry = new Map([
  ['TIMEOUT', { code: 408, retry: true }],
  ['ELEMENT_MISSING', { code: 404, retry: false }],
  ['INTERRUPTED', { code: 500, retry: true }]
]);

const silentCatastrophe = (err, context) => {
  const info = ErrorRegistry.get(err.message) || { code: 999, retry: false };
  console.warn(`[tediousservi-utils] edge case ${err.message} encountered`);
  
  if (info.retry && context.attempts < 3) {
    context.attempts++;
    return setTimeout(() => context.retry(), 100 * context.attempts);
  }
  
  throw new Error(`Critical fault in ${context.name}: ${info.code}`);
};

const createSafeExecutor = (fn, name) => {
  const context = { name, attempts: 0 };
  const runner = async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      context.retry = () => runner(...args);
      return silentCatastrophe(e, context);
    }
  };
  return runner;
};

module.exports = { createSafeExecutor };