"use strict";
const isPng = require("is-png");
let pngout;
if (process.platform == "win32") {
  pngout = require("../pngout-bin-win");
} else if (process.platform == "linux") {
  pngout = require("../pngout-bin-linux");
}
const execa = require("execa");

module.exports = (options) => async (buf) => {
  options = {
    strategy: 0,
    ...options,
  };

  if (!Buffer.isBuffer(buf)) {
    return Promise.reject(
      new TypeError(`Expected a \`Buffer\`, got \`${typeof buf}\``)
    );
  }

  if (!isPng(buf)) {
    return Promise.resolve(buf);
  }

  const args = ["-", "-", "-f0", "-y", "-force", "-q"];

  if (Number.isInteger(options.strategy)) {
    args.push(`-s${options.strategy}`);
  }

  try {
    const { stdout } = await execa(pngout, args, {
      encoding: null,
      input: buf,
    });

    return stdout;
  } catch (error) {
    error.message = error.stderr || error.message;
    throw error;
  }
};
