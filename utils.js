class ClickPatternEngine {
  constructor(baseInterval = 100, variance = 0.25) {
    this.baseInterval = baseInterval;
    this.variance = variance;
    this.seed = (Date.now() ^ (Math.random() * 0xffff)) >>> 0;
  }

  _nextJitter() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    const normalized = (this.seed / 4294967296) * 2 - 1;
    return normalized * this.variance * this.baseInterval;
  }

  packClick(x, y, delayMs) {
    const uX = BigInt(Math.max(0, Math.min(65535, x & 0xffff)));
    const uY = BigInt(Math.max(0, Math.min(65535, y & 0xffff)));
    const uDelay = BigInt(Math.max(0, Math.min(4294967295, delayMs & 0xffffffff)));
    return (uX << 48n) | (uY << 32n) | uDelay;
  }

  unpackClick(packed) {
    const big = BigInt(packed);
    return {
      x: Number((big >> 48n) & 0xffffn),
      y: Number((big >> 32n) & 0xffffn),
      delayMs: Number(big & 0xffffffffn)
    };
  }

  *generateSchedule(points) {
    for (const [x, y] of points) {
      const jitter = this._nextJitter();
      const executionDelay = Math.max(10, Math.round(this.baseInterval + jitter));
      const packed = this.packClick(x, y, executionDelay);
      yield { ...this.unpackClick(packed), rawPacked: packed };
    }
  }
}

function parseAndSanitizeCoordinates(rawString) {
  return rawString
    .split(';')
    .map(pair => pair.split(',').map(Number))
    .filter(([x, y]) => !isNaN(x) && !isNaN(y));
}

module.exports = { ClickPatternEngine, parseAndSanitizeCoordinates };