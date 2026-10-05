class ChaoticJitter {
  constructor(seed = 0.35, r = 3.91) {
    this.x = seed;
    this.r = r;
  }

  next() {
    this.x = this.r * this.x * (1 - this.x);
    return this.x;
  }

  generateIntervals(baseDelay, maxJitter, length) {
    const sequence = [];
    for (let i = 0; i < length; i++) {
      const noise = this.next() - 0.5;
      const fatigue = Math.sin(i * 0.15) * (maxJitter * 0.3);
      const calculated = Math.round(baseDelay + (noise * maxJitter) + fatigue);
      sequence.push(Math.max(1, calculated));
    }
    return sequence;
  }
}

module.exports = { ChaoticJitter };