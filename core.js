/**
 * @typedef {Object} ClickConfig
 * @property {number} cps - Target clicks per second
 * @property {number} jitter - Random variance factor (0.0 to 1.0) for anti-cheat evasion
 * @property {EventTarget|null} target - DOM target element receiving click events
 * @property {boolean} [burstMode] - Enable intermittent micro-burst click clusters
 */

/**
 * @typedef {Object} ClickStats
 * @property {number} totalClicks - Total accumulated click count
 * @property {number} durationMs - Active duration in milliseconds
 * @property {number} averageCps - Measured average clicks per second
 */

/**
 * High-precision autoclicker engine utilizing async generators and Gaussian delay distribution.
 */
export class AutoclickEngine {
  /**
   * @param {ClickConfig} config - Clicker engine parameters
   */
  constructor(config) {
    /** @type {ClickConfig} */
    this.config = { burstMode: false, ...config };
    /** @type {boolean} */
    this.active = false;
    /** @type {number} */
    this.clickCounter = 0;
    /** @type {number|null} */
    this.startTime = null;
  }

  /**
   * Calculates dynamic delay intervals using Box-Muller transform for natural jitter.
   * @private
   * @returns {number} Computed millisecond delay
   */
  _calculateDelay() {
    const baseInterval = 1000 / Math.max(1, this.config.cps);
    const u1 = Math.max(Number.EPSILON, Math.random());
    const u2 = Math.random();
    const gaussian = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const variance = baseInterval * (this.config.jitter || 0.1) * gaussian;
    return Math.max(4, baseInterval + variance);
  }

  /**
   * Asynchronous generator producing simulated mouse click event stream.
   * @async
   * @generator
   * @yields {Promise<MouseEvent>} Dispatched mouse click event
   */
  async *clickStream() {
    this.startTime = performance.now();
    this.active = true;

    while (this.active) {
      const delay = this._calculateDelay();
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (!this.active) break;

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: Math.floor(Math.random() * 3),
        clientY: Math.floor(Math.random() * 3),
      });

      if (this.config.target) {
        this.config.target.dispatchEvent(event);
      }

      this.clickCounter++;
      yield event;
    }
  }

  /**
   * Terminates active click engine stream and generates summary metrics.
   * @returns {ClickStats} Execution statistical breakdown
   */
  stop() {
    this.active = false;
    const elapsed = this.startTime ? performance.now() - this.startTime : 0;
    return {
      totalClicks: this.clickCounter,
      durationMs: Math.round(elapsed),
      averageCps: elapsed > 0 ? Number(((this.clickCounter / elapsed) * 1000).toFixed(2)) : 0,
    };
  }
}