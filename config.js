const CONFIG_DEFAULTS = {
  interval: 100,
  jitter: 0.15,
  active: false,
  mouseButton: 0
};

const storageKey = 'tediousservi_config';

const syncConfig = (patch = {}) => {
  const current = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const updated = { ...CONFIG_DEFAULTS, ...current, ...patch };
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return updated;
};

const getJitteredInterval = (base, variance) => {
  const shift = base * variance;
  return base + (Math.random() * (shift * 2) - shift);
};

const loadConfig = () => syncConfig();

const updateConfig = (key, value) => {
  return syncConfig({ [key]: value });
};

export { 
  loadConfig, 
  updateConfig, 
  getJitteredInterval 
};