const fs = require('fs');

const DEFAULT_CONFIG = Object.freeze({
  cps: 12,
  button: 'left',
  jitter: 0.15,
  targetWindow: 'Active Window',
  hotkeys: { start: 'F8', stop: 'F9', emergency: 'Escape' },
  burstMode: { enabled: false, count: 5, pauseMs: 200 },
  humanize: true
});

function loadConfig(userPath = null, overrides = {}) {
  let userConfig = {};

  if (userPath && fs.existsSync(userPath)) {
    try {
      const raw = fs.readFileSync(userPath, 'utf8');
      userConfig = JSON.parse(raw);
    } catch {
      userConfig = {};
    }
  }

  const merged = Object.assign({}, DEFAULT_CONFIG, userConfig, overrides);
  merged.hotkeys = Object.assign({}, DEFAULT_CONFIG.hotkeys, userConfig.hotkeys, overrides.hotkeys);
  merged.burstMode = Object.assign({}, DEFAULT_CONFIG.burstMode, userConfig.burstMode, overrides.burstMode);

  return new Proxy(merged, {
    get(target, prop, receiver) {
      if (prop === 'intervalMs') {
        const baseMs = 1000 / Math.max(1, target.cps);
        if (!target.humanize || target.jitter <= 0) return baseMs;
        const variance = (Math.random() * 2 - 1) * target.jitter * baseMs;
        return Math.max(1, Math.round(baseMs + variance));
      }
      if (prop === 'export') {
        return () => JSON.stringify(target, null, 2);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

module.exports = { loadConfig, DEFAULT_CONFIG };