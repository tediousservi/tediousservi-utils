const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const jitter = (value, percent = 0.1) => {
  const variance = value * percent;
  return value + (Math.random() * variance * 2 - variance);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clickSequence = async (count, baseDelay) => {
  for (let i = 0; i < count; i++) {
    console.log(`Executing click ${i + 1}/${count}`);
    await sleep(jitter(baseDelay, 0.2));
  }
};

const humanizedDelay = (base, variation = 50) => base + Math.round(Math.random() * variation * 2 - variation);

const coordinateScrambler = (x, y, range = 5) => ({
  x: x + getRandomInt(-range, range),
  y: y + getRandomInt(-range, range)
});

module.exports = {
  getRandomInt,
  jitter,
  sleep,
  clickSequence,
  humanizedDelay,
  coordinateScrambler
};