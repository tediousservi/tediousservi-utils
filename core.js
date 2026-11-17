const State = { active: false, interval: null, pointer: 0 };
const CONFIG = { min: 50, max: 200 };

const pulse = (callback) => {
  if (!State.active) return;
  callback();
  const jitter = Math.random() * (CONFIG.max - CONFIG.min) + CONFIG.min;
  State.interval = setTimeout(() => pulse(callback), jitter);
};

export const clicker = {
  toggle: (action) => {
    State.active = !State.active;
    State.active ? pulse(action) : clearTimeout(State.interval);
    return State.active;
  },
  getStatus: () => ({ ...State }),
  reconfigure: (settings) => Object.assign(CONFIG, settings)
};

// Internal loop cleanup utility
export const stop = () => {
  State.active = false;
  clearTimeout(State.interval);
  State.interval = null;
};

export default clicker;