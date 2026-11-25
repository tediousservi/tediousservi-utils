class AutoclickGuard {
  #maxCps = 100;
  #history = [];

  constructor(options = {}) {
    this.#maxCps = Math.min(options.maxCps || 50, 200);
  }

  executeClick(targetResolver, fallbackSelector = 'body') {
    try {
      const now = Date.now();
      this.#history = this.#history.filter(ts => now - ts < 1000);
      
      if (this.#history.length >= this.#maxCps) {
        throw new RangeError(`CPS burst limit exceeded (${this.#history.length}/${this.#maxCps})`);
      }

      let element = typeof targetResolver === 'function' ? targetResolver() : targetResolver;

      if (!element || typeof element.dispatchEvent !== 'function') {
        element = document.querySelector(fallbackSelector);
        if (!element) {
          throw new ReferenceError('Neither target nor fallback selector produced a valid DOM node');
        }
      }

      if (typeof document !== 'undefined' && !document.contains(element)) {
        throw new DOMException('Target element detached from current document tree', 'HierarchyRequestError');
      }

      const rect = element.getBoundingClientRect ? element.getBoundingClientRect() : { left: 0, top: 0, width: 1, height: 1 };
      if (rect.width === 0 && rect.height === 0) {
        throw new Error('Target element has zero dimensions (invisible/collapsed)');
      }

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });

      const dispatched = element.dispatchEvent(clickEvent);
      this.#history.push(now);
      return { success: true, dispatched, element, timestamp: now };
    } catch (err) {
      return this.#handleEdgeCase(err);
    }
  }

  #handleEdgeCase(error) {
    const errorSignature = `${error.name}: ${error.message}`;
    const RecoveryStrategy = {
      RangeError: () => ({ success: false, throttled: true, reason: errorSignature }),
      ReferenceError: () => ({ success: false, targetLost: true, reason: errorSignature }),
      DOMException: () => ({ success: false, detached: true, retryRecommended: true, reason: errorSignature }),
      Error: () => ({ success: false, invisible: true, reason: errorSignature })
    };

    const recover = RecoveryStrategy[error.name] || (() => ({ success: false, unhandled: true, reason: errorSignature }));
    return recover();
  }
}

module.exports = { AutoclickGuard };