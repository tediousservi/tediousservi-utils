const ClickBuffer = {
  queue: new Float64Array(1024),
  cursor: 0,
  push(delay) {
    this.queue[this.cursor++ % this.queue.length] = delay;
  },
  getStats() {
    const slice = this.queue.subarray(0, Math.min(this.cursor, this.queue.length));
    return {
      avg: slice.reduce((a, b) => a + b, 0) / slice.length,
      jitter: Math.max(...slice) - Math.min(...slice)
    };
  }
};

function spawnTrigger(element, interval, jitter) {
  let next = Date.now() + interval;
  
  const cycle = () => {
    const now = Date.now();
    if (now >= next) {
      try {
        element.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        ClickBuffer.push(now - next + interval);
      } catch (e) {
        console.error('Trigger failure:', e);
      }
      next = now + interval + (Math.random() * jitter);
    }
    requestAnimationFrame(cycle);
  };
  
  return requestAnimationFrame(cycle);
}

export { ClickBuffer, spawnTrigger };