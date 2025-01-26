const isWsl = require("is-wsl");
const ClipboardWin = require("./win32.js");
const ClipboardWSL = require("./wsl.js");
const ClipboardMac = require("./mac.js");
const PluginError = require("../error.js");

function Clipboard() {
  const platform = process.platform;
  const isActuallyWsl = isWsl.default || isWsl;
  if (platform === "win32") {
    return new ClipboardWin();
  } else if (isActuallyWsl === true) {
    return new ClipboardWSL();
  } else if (platform === "darwin") {
    return new ClipboardMac();
  } else if (platform === "linux") {
    throw new PluginError("under development");
  } else {
    throw new PluginError("unknown platform")
  }
}

module.exports = Clipboard();
