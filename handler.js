const robot = require('robotjs');

const clickLogic = {
  interval: null,
  jitter: (val, range = 5) => val + Math.floor(Math.random() * range * 2) - range,
  rapidFire: (x, y, delay, duration) => {
    const end = Date.now() + duration;
    return new Promise(resolve => {
      clickLogic.interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(clickLogic.interval);
          return resolve(true);
        }
        robot.moveMouse(clickLogic.jitter(x), clickLogic.jitter(y));
        robot.mouseClick();
      }, delay);
    });
  },
  patternSequence: (coords, delay) => {
    coords.forEach(pos => {
      setTimeout(() => {
        robot.moveMouseSmooth(pos.x, pos.y);
        robot.mouseClick();
      }, delay);
    });
  },
  safetyBreak: () => {
    clearInterval(clickLogic.interval);
    process.exit(0);
  }
};

module.exports = clickLogic;