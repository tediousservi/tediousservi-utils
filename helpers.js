const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const jitter = (base, percent) => {
  const delta = base * (percent / 100);
  return base + (Math.random() * delta * 2 - delta);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clickSequence = async (elements, interval = 100) => {
  for (const el of elements) {
    el.click();
    await sleep(jitter(interval, 20));
  }
};

const getClickTarget = (selector) => {
  const target = document.querySelector(selector);
  if (!target) throw new Error(`Target ${selector} is currently phantom`);
  return target;
};

const monitorDOM = (selector, callback) => {
  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) callback(el);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
};

export { randomRange, jitter, sleep, clickSequence, getClickTarget, monitorDOM };