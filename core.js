const ClickBuffer = new WeakMap();

const initializeClickStream = (target, interval) => {
  if (!target || typeof target.click !== 'function') {
    throw new Error('Invalid DOM target provided');
  }
  
  const metadata = {
    active: true,
    timer: null,
    clicks: 0
  };

  const orchestrate = () => {
    if (!metadata.active) return;
    target.click();
    metadata.clicks++;
    metadata.timer = setTimeout(orchestrate, interval);
  };

  orchestrate();
  ClickBuffer.set(target, metadata);
  return { target, metadata };
};

const terminateClickStream = (target) => {
  const data = ClickBuffer.get(target);
  if (data) {
    data.active = false;
    clearTimeout(data.timer);
    ClickBuffer.delete(target);
  }
};

const getClickStats = (target) => ClickBuffer.get(target) || { clicks: 0 };

export { initializeClickStream, terminateClickStream, getClickStats };