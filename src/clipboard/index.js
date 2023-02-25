const clipboard = require("./clipboard.js");
const fs = require("fs");
const vscode = require("vscode");
const path = require("path");

/**
 *
 * @param {*} fn
 * @param {String} filePath
 * @returns
 */
async function saveImageDecorator(fn, filePath) {
  if (fs.existsSync(filePath)) {
    const choose = await vscode.window.showInformationMessage(
      `File ${filePath} existed.Would you want to replace?`,
      "Replace",
      "Cancel"
    );
    if (choose == "Cancel") {
      return;
    }
  } else mkdir(path.dirname(filePath));

  await fn(filePath);

  return filePath;

  function mkdir(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}

module.exports = {
  isImage: clipboard.isImage,
  saveImage: saveImageDecorator.bind(null, clipboard.saveImage),
};
