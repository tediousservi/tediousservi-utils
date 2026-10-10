const validateInput = (input) => {
  const schema = { rate: 'number', duration: 'number', enabled: 'boolean' };
  return Object.keys(schema).every(key => 
    typeof input[key] === schema[key] && input[key] !== null
  );
};

const pulse = (ctx) => {
  if (!validateInput(ctx.config)) {
    console.error('[!] erratic config detected: halting execution');
    return null;
  }
  return setInterval(() => {
    if (!ctx.config.enabled) return;
    try {
      executeClick(ctx.coords);
    } catch (e) {
      console.warn('ghost click incident:', e.message);
    }
  }, ctx.config.rate);
};

const executeClick = (pos) => {
  const event = new MouseEvent('click', { clientX: pos.x, clientY: pos.y });
  document.dispatchEvent(event);
};

export const initProcessor = (config, coords) => {
  const ctx = { config, coords };
  const loop = pulse(ctx);
  
  if (loop) {
    setTimeout(() => clearInterval(loop), config.duration);
  }
  return loop;
};