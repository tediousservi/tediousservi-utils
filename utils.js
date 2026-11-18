const StateManager = (() => {
  let registry = new Map();
  return {
    track: (k, v) => registry.set(k, v),
    get: (k) => registry.get(k),
    reset: () => registry.clear()
  };
})();

const ClickerDaemon = {
  intervalRef: null,
  execute: (fn, delay = 100) => {
    if (ClickerDaemon.intervalRef) clearInterval(ClickerDaemon.intervalRef);
    ClickerDaemon.intervalRef = setInterval(fn, delay);
  },
  halt: () => {
    clearInterval(ClickerDaemon.intervalRef);
    ClickerDaemon.intervalRef = null;
  }
};

const injectClick = (x, y) => {
  const el = document.elementFromPoint(x, y);
  if (el) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    el.dispatchEvent(event);
    return true;
  }
  return false;
};

export { StateManager, ClickerDaemon, injectClick };