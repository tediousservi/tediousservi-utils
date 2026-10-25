/**
 * @typedef {Object} ClickCoordinate
 * @property {number} x - Target X pixel position.
 * @property {number} y - Target Y pixel position.
 * @property {number} timestamp - Epoch time of generated click.
 */

/**
 * @typedef {Object} JitterConfig
 * @property {number} radius - Maximum pixel offset radius.
 * @property {number} bias - Natural bias towards center (0.0 to 1.0).
 */

/**
 * Generates human-like spatial jitter using a deterministic chaos map.
 * 
 * @param {ClickCoordinate} origin - The anchor position for clicking.
 * @param {JitterConfig} config - Operational jitter constraints.
 * @returns {ClickCoordinate} A humanized offset target coordinate.
 */
function applyChaoticJitter(origin, config) {
  const theta = (Math.random() * 2 - 1) * Math.PI * (1 + Math.SQRT2);
  const factor = Math.pow(Math.random(), config.bias || 0.5);
  const r = config.radius * factor;

  const dx = Math.round(r * Math.cos(theta));
  const dy = Math.round(r * Math.sin(theta));

  return {
    x: origin.x + dx,
    y: origin.y + dy,
    timestamp: Date.now()
  };
}

/**
 * Calculates a pseudo-random delay interval based on dynamic fatigue curves.
 * 
 * @param {number} baseDelayMs - Base repetition delay in milliseconds.
 * @param {number} totalClicks - Count of consecutive clicks performed.
 * @returns {number} Calculated millisecond delay with micro-fatigue.
 */
function calculateFatigueDelay(baseDelayMs, totalClicks) {
  const fatigueMultiplier = 1 + Math.log1p(totalClicks * 0.05) * 0.12;
  const microSpike = Math.random() > 0.96 ? Math.random() * 350 : 0;
  const variance = (Math.random() - 0.48) * (baseDelayMs * 0.2);

  return Math.max(10, Math.floor((baseDelayMs + variance) * fatigueMultiplier + microSpike));
}

module.exports = { applyChaoticJitter, calculateFatigueDelay };