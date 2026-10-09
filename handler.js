const handler = {
  jitter: (ms, variance = 0.2) => {
    const delta = ms * variance;
    return Math.floor(ms + (Math.random() * delta * 2 - delta));
  },
  sequence: async (actions, interval = 100) => {
    for (const action of actions) {
      await new Promise(r => setTimeout(r, handler.jitter(interval)));
      action();
    }
  },
  createClicker: (selector) => ({
    press: () => document.querySelector(selector)?.click(),
    exists: () => !!document.querySelector(selector)
  }),
  monitor: (target, callback) => {
    const obs = new MutationObserver(callback);
    obs.observe(target, { childList: true, subtree: true });
    return () => obs.disconnect();
  },
  throttle: (fn, limit) => {
    let wait = false;
    return (...args) => {
      if (!wait) {
        fn(...args);
        wait = true;
        setTimeout(() => (wait = false), limit);
      }
    };
  }
};

export default handler;