const ClickBuffer = {
  queue: new WeakMap(),
  add(target, sequence) {
    const payload = Array.isArray(sequence) ? sequence : [sequence];
    this.queue.set(target, [...(this.queue.get(target) || []), ...payload]);
  },
  dispatch(target, windowRef = window) {
    const clicks = this.queue.get(target) || [];
    clicks.forEach((evt, i) => {
      setTimeout(() => {
        const mouseEvent = new MouseEvent('click', { bubbles: true, ...evt });
        target.dispatchEvent(mouseEvent);
      }, i * (evt.delay || 50));
    });
    this.queue.delete(target);
  }
};

const serializeSequence = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (e) {
    return null;
  }
};

const deserializeSequence = (str) => {
  try {
    return JSON.parse(atob(str));
  } catch (e) {
    return [];
  }
};

export { ClickBuffer, serializeSequence, deserializeSequence };