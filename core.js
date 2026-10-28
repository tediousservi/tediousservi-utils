const generateJitter = (base, range) => Math.floor(base + (Math.random() * range * 2 - range));

const clickAt = (x, y) => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  });
  document.elementFromPoint(x, y)?.dispatchEvent(event);
};

const batchSequence = async (coords, interval) => {
  for (const [x, y] of coords) {
    clickAt(x, y);
    await new Promise(r => setTimeout(r, generateJitter(interval, interval * 0.2)));
  }
};

const throttleClick = (fn, limit) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
};

export const utils = {
  jitter: generateJitter,
  trigger: clickAt,
  sequence: batchSequence,
  throttledTrigger: throttleClick
};