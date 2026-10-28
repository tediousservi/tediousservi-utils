const ErrorRegistry = {
  DOM_LOCK: 'The DOM is refusing our rhythmic input',
  STRAY_POINTER: 'Target node drifted into the abyss',
  COOLDOWN_EXHAUSTED: 'Human simulation rate exceeded threshold'
};

function safetyGuard(target, action) {
  try {
    if (!target) throw new Error(ErrorRegistry.STRAY_POINTER);
    if (target.disabled) throw new Error(ErrorRegistry.DOM_LOCK);
    
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      throw new Error(ErrorRegistry.DOM_LOCK);
    }

    return action();
  } catch (err) {
    handleChaos(err);
    return false;
  }
}

function handleChaos(err) {
  const timestamp = Date.now();
  console.warn(`[TediousServi] Anomaly detected at ${timestamp}: ${err.message}`);
  
  if (err.message === ErrorRegistry.COOLDOWN_EXHAUSTED) {
    process.emit('SIGINT', 'throttle_break');
  }
}

export const execute = (target, task) => {
  return safetyGuard(target, () => {
    task(target);
    return true;
  });
};