/**
 * @typedef {Object} LogOptions
 * @property {string} [prefix='[TEDIOUS]']
 * @property {boolean} [verbose=false]
 */

/**
 * @param {string} msg
 * @param {LogOptions} opts
 * @returns {void}
 */
const log = (msg, opts = {}) => {
  const prefix = opts.prefix || '[TEDIOUS]';
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  
  const payload = `${prefix} ${timestamp} :: ${msg}`;
  
  if (opts.verbose) {
    console.debug(`%c${payload}`, 'color: #00ff00; font-weight: bold;');
  } else {
    process.stdout.write(payload + '\n');
  }
};

/**
 * @param {Error|string} error
 * @returns {void}
 */
const error = (error) => {
  const message = error instanceof Error ? error.message : error;
  console.error(`[FATAL] ${new Date().toLocaleTimeString()} -> ${message}`);
};

module.exports = { log, error };