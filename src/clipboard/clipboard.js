const isWsl = require("is-wsl");
const ClipboardWin = require("./win32.js");
const ClipboardWSL = require("./wsl.js");
function Clipboard() {
  const platform = process.platform;
  if (platform == "win32") {
    return new ClipboardWin();
  } else if (isWsl) {
    return new ClipboardWSL();
  }
}

module.exports = Clipboard();
