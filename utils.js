class ClickDataPipeline {
  constructor(baseIntervalMs = 100, entropyFactor = 0.15) {
    this.baseInterval = baseIntervalMs;
    this.entropy = entropyFactor;
    this.buffer = new Uint32Array(1024);
    this.head = 0;
  }

  *generateJitteredSequence(count, bounds = { x: 1920, y: 1080 }) {
    let lastX = Math.floor(bounds.x / 2);
    let lastY = Math.floor(bounds.y / 2);

    for (let i = 0; i < count; i++) {
      const u1 = Math.random() || 0.0001;
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const intervalJitter = Math.floor(this.baseInterval + z0 * (this.baseInterval * this.entropy));
      const deltaX = Math.floor(z0 * 5);
      const deltaY = Math.floor(Math.sin(z0) * 5);

      lastX = Math.max(0, Math.min(bounds.x, lastX + deltaX));
      lastY = Math.max(0, Math.min(bounds.y, lastY + deltaY));

      const packedData = (lastX & 0xFFF) | ((lastY & 0xFFF) << 12);
      this.buffer[this.head++ % this.buffer.length] = packedData;

      yield {
        index: i,
        x: lastX,
        y: lastY,
        delay: Math.max(10, intervalJitter),
        checksum: (packedData ^ intervalJitter) >>> 0
      };
    }
  }

  parsePackedCoordinate(packed) {
    return {
      x: packed & 0xFFF,
      y: (packed >> 12) & 0xFFF
    };
  }

  getBufferedHistory() {
    return Array.from(this.buffer.slice(0, Math.min(this.head, this.buffer.length)))
      .map(packed => this.parsePackedCoordinate(packed));
  }
}

module.exports = { ClickDataPipeline };