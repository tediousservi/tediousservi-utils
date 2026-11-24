const defaultOptions = {
  maxAttempts: 5,
  baseDelayMs: 120,
  maxDelayMs: 3000,
  jitterFactor: 0.3,
  backoffMultiplier: 1.8
};

function* jitteredBackoff(opts) {
  let delay = opts.baseDelayMs;
  while (true) {
    const jitter = (Math.random() * 2 - 1) * opts.jitterFactor * delay;
    yield Math.min(opts.maxDelayMs, Math.max(10, Math.floor(delay + jitter)));
    delay *= opts.backoffMultiplier;
  }
}

async function executeWithRetry(operation, options = {}) {
  const config = { ...defaultOptions, ...options };
  const delays = jitteredBackoff(config);
  let lastError = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const payload = await operation({ attempt, isLastAttempt: attempt === config.maxAttempts });
      return { ok: true, attemptCount: attempt, payload };
    } catch (err) {
      lastError = err;
      if (attempt < config.maxAttempts) {
        const waitTime = delays.next().value;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  return {
    ok: false,
    attemptCount: config.maxAttempts,
    error: lastError || new Error('Network operation exceeded attempt threshold')
  };
}

function createClickerSyncRequest(url, payload = {}, retryOpts = {}) {
  return executeWithRetry(async ({ attempt }) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Clicker-Sequence': String(Date.now()),
        'X-Retry-Attempt': String(attempt)
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Sync failure: HTTP ${response.status}`);
    }
    return await response.json();
  }, retryOpts);
}

module.exports = { executeWithRetry, createClickerSyncRequest };