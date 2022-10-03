const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard/clipboard.js");
// const clipboard = require("./clipboard/clipboard.js"); es6 module not supported

async function main() {
  vscode.window.showInformationMessage("Hello World from md-paste-jpg!");
  let clipContent = await vscode.env.clipboard.readText(); // 提升速度, 有文件则不用判断是否为图片
  if (clipContent == "" && (await clipboard.isImage())) {
    vscode.window.showInformationMessage("is image");
  } else {
    try {
      vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    } catch (e) {
      vscode.commands.executeCommand("markdown.extension.editing.paste");
    }
  }
}

function getFileName() {
  return "";
}

function saveImg() {}

const path = require("path");

// 在markdown中渲染的形式
function render(basePath, imgPath) {
  if (basePath) {
    imgPath = path.relative(basePath, imgPath);
  }
}

module.exports = {
  main,
};
