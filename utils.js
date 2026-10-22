/**
 * Dynamic network retry pipeline with click-cadence jitter
 * for remote macro sync and target template fetching.
 */

function* fibonacciGenerator() {
  let [a, b] = [100, 200];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

async function retryNetworkOp(operation, options = {}) {
  const {
    maxRetries = 5,
    jitterFactor = 0.35,
    onRetry = null,
    shouldRetry = () => true
  } = options;

  const delayGen = fibonacciGenerator();
  let attempt = 0;
  let lastError;

  while (attempt <= maxRetries) {
    try {
      return await operation(attempt);
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries || !shouldRetry(err)) {
        break;
      }

      attempt++;
      const baseDelay = delayGen.next().value;
      const jitter = (Math.random() * 2 - 1) * jitterFactor * baseDelay;
      const actualDelay = Math.max(50, Math.floor(baseDelay + jitter));

      if (typeof onRetry === 'function') {
        onRetry({ attempt, delay: actualDelay, error: err });
      }

      await new Promise(resolve => setTimeout(resolve, actualDelay));
    }
  }

  throw new Error(`Network operation failed after ${attempt} attempts. Last error: ${lastError?.message || lastError}`);
}

module.exports = {
  retryNetworkOp,
  fibonacciGenerator
};