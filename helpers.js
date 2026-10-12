/**
 * Human-like click pattern generators using chaotic math functions.
 */

// Logistic map generator for deterministic pseudo-human timing variance
function* chaosJitter(r = 3.9, seed = 0.5) {
  let x = seed;
  while (true) {
    x = r * x * (1 - x);
    yield x;
  }
}

const defaultChaos = chaosJitter();

/**
 * Calculates a dynamic delay (ms) blending base interval with chaotic jitter.
 */
function calculateDelay(baseMs, varianceMs = 15) {
  const norm = defaultChaos.next().value;
  const offset = (norm - 0.5) * 2 * varianceMs;
  return Math.max(1, Math.round(baseMs + offset));
}

/**
 * Generates micro-drift coordinates around a target (x, y) to mimic human touch/mouse inaccuracy.
 */
function applyDrift(x, y, maxRadius = 3) {
  const angle = defaultChaos.next().value * 2 * Math.PI;
  const radius = defaultChaos.next().value * maxRadius;
  return {
    x: Math.round(x + radius * Math.cos(angle)),
    y: Math.round(y + radius * Math.sin(angle))
  };
}

/**
 * Creates a burst sequence of click delays with fatigue simulation.
 */
function createBurstSequence(count, baseIntervalMs, fatigueFactor = 1.05) {
  const sequence = [];
  let currentInterval = baseIntervalMs;

  for (let i = 0; i < count; i++) {
    sequence.push(calculateDelay(currentInterval, 10));
    currentInterval *= fatigueFactor;
  }

  return sequence;
}

module.exports = {
  chaosJitter,
  calculateDelay,
  applyDrift,
  createBurstSequence
};