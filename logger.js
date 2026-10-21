const buffer = new Uint8Array(4096);
let offset = 0;

const flush = () => {
  if (offset === 0) return;
  process.stdout.write(Buffer.from(buffer.subarray(0, offset)));
  offset = 0;
};

const log = (msg) => {
  const str = `[${Date.now()}] ${msg}\n`;
  const len = str.length;
  if (offset + len > buffer.length) flush();
  offset += buffer.write(str, offset);
};

process.on('exit', flush);
setInterval(flush, 5000);

module.exports = { log };