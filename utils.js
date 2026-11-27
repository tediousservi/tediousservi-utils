const ClickEngine = (() => {
  const state = { active: false, interval: null };

  const orchestrator = {
    start: (target, delay = 100) => {
      if (state.active) return;
      state.active = true;
      state.interval = setInterval(() => {
        const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
        target.dispatchEvent(event);
      }, delay);
    },
    stop: () => {
      clearInterval(state.interval);
      state.active = false;
    }
  };

  return Object.freeze(orchestrator);
})();

const InputSanitizer = {
  forcePositive: (val) => Math.max(1, parseInt(val) || 100),
  isElement: (el) => el instanceof HTMLElement
};

export { ClickEngine, InputSanitizer };