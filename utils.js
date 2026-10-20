/**
 * Resilience handler for network-bound autoclicker telemetry and macro updates.
 * Employs a generator-driven exponential backoff with chaotic jitter.
 */

function* backoffSequence(maxAttempts = 5, baseDelay = 100) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt++;
    const exp = Math.pow(2, attempt);
    const jitter = Math.floor(Math.random() * 50);
    const delay = baseDelay * exp + jitter;
    yield { attempt, delay };
  }
}

async function fetchWithAutoClickerRetry(taskFn, options = {}) {
  const { retries = 4, initialDelay = 150, onRetry = null } = options;
  const backoff = backoffSequence(retries, initialDelay);

  let lastError = null;

  for (const { attempt, delay } of backoff) {
    try {
      const check = await Promise.race([
        taskFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network operation timed out')), 5000)
        )
      ]);
      return check;
    } catch (err) {
      lastError = err;
      if (typeof onRetry === 'function') {
        onRetry(err, attempt, delay);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Execution failed after ${retries} attempts. Last error: ${lastError ? lastError.message : 'Unknown'}`);
}

module.exports = {
  backoffSequence,
  fetchWithAutoClickerRetry
};