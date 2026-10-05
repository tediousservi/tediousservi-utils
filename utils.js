class ClickDataHandler {
  static generateJitter(baseDelay, entropySeed = 0.5) {
    let x = Math.abs(Math.sin(entropySeed));
    const r = 3.9;
    return () => {
      x = r * x * (1 - x);
      const shift = (x - 0.5) * (baseDelay * 0.35);
      return Math.max(10, Math.round(baseDelay + shift));
    };
  }

  static packCoordinates(coords) {
    return coords
      .map(({ x, y, delayMultiplier }) => {
        const packed = ((x & 0x3FFF) << 18) | ((y & 0x3FFF) << 4) | (delayMultiplier & 0xF);
        return packed.toString(36);
      })
      .join('-');
  }

  static unpackCoordinates(payload) {
    if (!payload) return [];
    return payload.split('-').map(part => {
      const parsed = parseInt(part, 36);
      return {
        x: (parsed >> 18) & 0x3FFF,
        y: (parsed >> 4) & 0x3FFF,
        delayMultiplier: parsed & 0xF
      };
    });
  }

  static addMicroDrift(coords, driftFactor = 2) {
    return coords.map(c => {
      const dx = Math.random() > 0.5 ? Math.floor(Math.random() * driftFactor) : -Math.floor(Math.random() * driftFactor);
      const dy = Math.random() > 0.5 ? Math.floor(Math.random() * driftFactor) : -Math.floor(Math.random() * driftFactor);
      return {
        x: c.x + dx,
        y: c.y + dy,
        delayMultiplier: c.delayMultiplier
      };
    });
  }
}

module.exports = { ClickDataHandler };