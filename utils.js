const clickSafetyValve = (target, attempts = 0) => {
  const MAX_ERRORS = 5;
  try {
    if (typeof target !== 'function') throw new TypeError('Target is not a function');
    return target();
  } catch (err) {
    if (attempts >= MAX_ERRORS) {
      console.error('Terminal click failure:', err.message);
      return null;
    }
    const jitter = Math.floor(Math.random() * 100);
    return new Promise(resolve => setTimeout(() => {
      resolve(clickSafetyValve(target, attempts + 1));
    }, 50 * (attempts + 1) + jitter));
  }
};

const validateElement = (el) => {
  if (!el || typeof el.click !== 'function') {
    throw new Error('Invalid DOM reference for autoclicker');
  }
  return el;
};

const safeTrigger = async (element) => {
  try {
    const node = validateElement(element);
    await clickSafetyValve(() => node.click());
    return { success: true, timestamp: Date.now() };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

module.exports = { safeTrigger, clickSafetyValve };