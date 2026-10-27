class AutoclickEdgeError extends Error {
  constructor(code, detail) {
    super(`[Autoclicker Edge Error 0x${code.toString(16).toUpperCase()}] ${detail}`);
    this.name = 'AutoclickEdgeError';
    this.code = code;
    this.timestamp = Date.now();
  }
}

const TARGET_BOUNDS = Object.freeze({ minX: 0, minY: 0, maxX: 7680, maxY: 4320 });

/**
 * Creates a Proxy-shielded click target runner that automatically cleans,
 * sanitizes, and recovers from unusual click parameter edge cases.
 */
export function createEdgeResilientRunner(targetHandler) {
  if (typeof targetHandler !== 'function') {
    throw new AutoclickEdgeError(0x101, 'Target handler must be an executable function');
  }

  return new Proxy(targetHandler, {
    apply(target, thisArg, args) {
      const [rawX, rawY, rawDelay = 100] = args;

      // Edge Case 1: Non-numeric or NaN coordinates coerced to valid space
      const x = Number.isFinite(Number(rawX)) ? Math.abs(Math.floor(Number(rawX))) : 0;
      const y = Number.isFinite(Number(rawY)) ? Math.abs(Math.floor(Number(rawY))) : 0;

      // Edge Case 2: Out of bounds check clamping
      const clampedX = Math.min(Math.max(x, TARGET_BOUNDS.minX), TARGET_BOUNDS.maxX);
      const clampedY = Math.min(Math.max(y, TARGET_BOUNDS.minY), TARGET_BOUNDS.maxY);

      // Edge Case 3: Invalid or impossibly fast/slow click interval protection
      const delay = Math.max(1, Math.min(10000, Math.abs(Number(rawDelay) || 100)));

      try {
        return Reflect.apply(target, thisArg, [{ x: clampedX, y: clampedY, delay }]);
      } catch (err) {
        const recoveryCode = (err && err.code) || 0x500;
        return {
          success: false,
          recovered: true,
          error: new AutoclickEdgeError(recoveryCode, err.message || 'Execution failed'),
          fallbackCoordinates: { x: 0, y: 0, delay: 500 }
        };
      }
    }
  });
}

export function sanitizeCPS(clicksPerSecond) {
  const parsed = parseFloat(clicksPerSecond);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return 10;
  return Math.min(Math.max(parsed, 0.1), 1000);
}