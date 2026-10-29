const DEFAULTS = Object.freeze({
  minDelayMs: 40,
  maxDelayMs: 120,
  jitterStrength: 0.25,
  maxBurstClicks: 100,
  targetSelector: '.click-target',
  antiDetection: true,
});

const createJitteredTiming = (min, max, strength) => {
  const base = min + Math.random() * (max - min);
  const variance = base * strength * (Math.random() - 0.5);
  return Math.floor(Math.max(10, base + variance));
};

class DynamicConfigStore {
  #data = new Map(Object.entries(DEFAULTS));

  constructor(initial = {}) {
    this.update(initial);
  }

  update(patch) {
    for (const [key, val] of Object.entries(patch)) {
      if (val !== undefined && val !== null) {
        this.#data.set(key, val);
      }
    }
    return this;
  }

  get nextInterval() {
    return createJitteredTiming(
      this.#data.get('minDelayMs'),
      this.#data.get('maxDelayMs'),
      this.#data.get('jitterStrength')
    );
  }

  toObject() {
    return Object.fromEntries(this.#data.entries());
  }
}

const store = new DynamicConfigStore();

export const config = new Proxy(store, {
  get(target, prop, receiver) {
    if (Reflect.has(target, prop)) {
      return Reflect.get(target, prop, receiver);
    }
    const state = target.toObject();
    return prop in state ? state[prop] : undefined;
  },
  set(target, prop, value) {
    target.update({ [prop]: value });
    return true;
  }
});