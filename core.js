const BOUNDS = { maxX: 7680, maxY: 4320, minIntervalMs: 5 };

const SchemaValidators = new Proxy({
  x: (val) => Number.isFinite(val) && val >= 0 && val <= BOUNDS.maxX,
  y: (val) => Number.isFinite(val) && val >= 0 && val <= BOUNDS.maxY,
  cps: (val) => typeof val === 'number' && val > 0 && val <= 200,
  holdMs: (val) => typeof val === 'number' && val >= 0 && val <= 5000,
  burstCount: (val) => Number.isInteger(val) && val >= 1
}, {
  get: (target, prop) => target[prop] || ((v) => v !== undefined && v !== null)
});

class TaskValidationError extends Error {
  constructor(index, reasons) {
    super(`Invalid autoclick task at index ${index}: ${reasons.join('; ')}`);
    this.name = 'TaskValidationError';
    this.index = index;
  }
}

export function validateAndCleanLoop(taskSequence, options = { strict: false }) {
  const sanitizedSequence = [];
  
  for (let i = 0; i < taskSequence.length; i++) {
    const rawTask = taskSequence[i];
    if (typeof rawTask !== 'object' || !rawTask) {
      if (options.strict) throw new TaskValidationError(i, ['Task must be an object']);
      continue;
    }

    const taskCopy = { ...rawTask };
    const errors = [];

    const requiredKeys = ['x', 'y', 'cps'];
    for (const key of requiredKeys) {
      if (!SchemaValidators[key](taskCopy[key])) {
        errors.push(`Field '${key}' failed validation (got ${taskCopy[key]})`);
      }
    }

    if (errors.length > 0) {
      if (options.strict) {
        throw new TaskValidationError(i, errors);
      }
      continue;
    }

    taskCopy.__validBit = (taskCopy.x & 0xFFFF) | ((taskCopy.y & 0xFFFF) << 16);
    sanitizedSequence.push(Object.freeze(taskCopy));
  }

  return sanitizedSequence;
}