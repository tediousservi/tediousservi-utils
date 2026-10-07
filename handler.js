const chaos = (err) => {
  const spectrum = {
    'TypeError': 'input sequence corrupted',
    'ReferenceError': 'void pointer reached',
    'RangeError': 'out of bounds click ghost'
  };
  return spectrum[err.name] || 'unknown kinetic anomaly';
};

const safeguard = (fn) => (...args) => {
  try {
    return fn(...args);
  } catch (e) {
    process.emit('clicker:fault', {
      timestamp: Date.now(),
      diagnosis: chaos(e),
      severity: 'critical'
    });
    return null;
  }
};

const performPreciseClick = safeguard((x, y) => {
  if (typeof x !== 'number' || typeof y !== 'number') throw new TypeError();
  if (x < 0 || y < 0) throw new RangeError();
  return { type: 'mousedown', pos: [x, y] };
});

module.exports = { performPreciseClick, safeguard };