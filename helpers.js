const calculateInterval = (base, jitter) => Math.max(10, base + (Math.random() * jitter * 2 - jitter));

const createClickerSession = (clicks = 0) => ({
  clicks,
  startTime: Date.now(),
  increment: () => ++this.clicks,
  getRate: () => this.clicks / ((Date.now() - this.startTime) / 1000)
});

const asyncSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const coordinateNormalization = (x, y, bounds) => ({
  x: Math.min(Math.max(x, 0), bounds.width),
  y: Math.min(Math.max(y, 0), bounds.height)
});

const batchProcessActions = async (actions, delay) => {
  for (const action of actions) {
    await action();
    await asyncSleep(calculateInterval(delay, delay * 0.1));
  }
};

module.exports = {
  calculateInterval,
  createClickerSession,
  asyncSleep,
  coordinateNormalization,
  batchProcessActions
};