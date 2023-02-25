"use strict";
const execBuffer = require("exec-buffer");
const isJpg = require("is-jpg");
let jpegtran;
if (process.platform == "win32") {
  jpegtran = require("../jpegtran-bin-win");
} else if (process.platform == "linux") {
  jpegtran = require("../jpegtran-bin-linux");
}
module.exports = (options) => (buf) => {
  options = { ...options };

  if (!Buffer.isBuffer(buf)) {
    return Promise.reject(new TypeError("Expected a buffer"));
  }

  if (!isJpg(buf)) {
    return Promise.resolve(buf);
  }

  const args = ["-copy", "none"];

  if (options.progressive) {
    args.push("-progressive");
  }

  if (options.arithmetic) {
    args.push("-arithmetic");
  } else {
    args.push("-optimize");
  }

  args.push("-outfile", execBuffer.output, execBuffer.input);

  return execBuffer({
    input: buf,
    bin: jpegtran,
    args,
  }).catch((error) => {
    error.message = error.stderr || error.message;
    throw error;
  });
};
