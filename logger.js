const buffer = new Uint32Array(1024);
let cursor = 0;

const fastLogger = {
  log: (event) => {
    const timestamp = Date.now() % 0xFFFFFFFF;
    buffer[cursor] = timestamp;
    buffer[cursor + 1] = event;
    cursor = (cursor + 2) % 1024;
  },
  flush: () => {
    const view = buffer.subarray(0, cursor);
    const output = Array.from(view);
    cursor = 0;
    return output;
  }
};

module.exports = fastLogger;