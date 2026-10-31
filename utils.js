class AutoclickerEdgeGuard extends Error {
  constructor(reason, details) {
    super(`Autoclicker Guard Failure: ${reason}`);
    this.name = 'AutoclickerEdgeGuard';
    this.details = details;
  }
}

export function createSafeClickTarget(target, constraints = {}) {
  const { maxFreqMs = 10, bounds = { minX: 0, maxX: 1920, minY: 0, maxY: 1080 } } = constraints;
  let lastClickTime = 0;

  return new Proxy(target, {
    get(obj, prop) {
      if (prop === 'triggerClick') {
        return function (x, y) {
          const now = Date.now();
          if (now - lastClickTime < maxFreqMs) {
            throw new AutoclickerEdgeGuard('Rate limit exceeded (frequency spike detected)', { interval: now - lastClickTime });
          }
          if (typeof x !== 'number' || typeof y !== 'number' || Number.isNaN(x) || Number.isNaN(y)) {
            throw new AutoclickerEdgeGuard('Invalid target coordinates', { x, y });
          }
          if (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
            throw new AutoclickerEdgeGuard('Coordinates out of virtual screen bounds', { x, y, bounds });
          }

          lastClickTime = now;
          if (typeof obj.click === 'function') {
            return obj.click(x, y);
          }
          return { status: 'simulated', x, y, timestamp: now };
        };
      }
      return Reflect.get(obj, prop);
    }
  });
}

export function executeWithFallback(taskFn, fallbackFn, maxRetries = 3) {
  return async function (...args) {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        return await taskFn(...args);
      } catch (err) {
        attempts++;
        if (err instanceof AutoclickerEdgeGuard) {
          if (attempts >= maxRetries) {
            return fallbackFn(err, ...args);
          }
          const delay = Math.pow(2, attempts) * 15 + Math.random() * 10;
          await new Promise((res) => setTimeout(res, delay));
        } else {
          throw err;
        }
      }
    }
  };
}