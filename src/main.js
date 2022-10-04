const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard/clipboard.js");
// const clipboard = require("./clipboard/clipboard.js"); es6 module not supported
const moment = require("moment");
const fs = require("fs");
const path = require("path");

async function main() {
  vscode.window.showInformationMessage("Hello World from md-paste-jpg!");
  let clipContent = await vscode.env.clipboard.readText(); // 提升速度, 有文件则不用判断是否为图片
  if (clipContent == "" && (await clipboard.isImage())) {
    try {
      pasteImage();
    } catch (e) {
      vscode.window.showInformationMessage(e);
    }
  } else {
    try {
      vscode.commands.executeCommand("markdown.extension.editing.paste"); // 兼容 markdown all in one
    } catch (e) {
      vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    }
  }
}

function pasteImage() {
  let fileName = getFileName() + ".png";
  let fileDir = getFileDir();
  saveImage(fileDir, fileName);
  // render();
}

function getFileName() {
  return getSelectText() || getDateName();

  function getSelectText() {
    let editor = vscode.window.activeTextEditor;
    let selectText = editor.document.getText(editor.selection);
    const validName = /[\\:*?<>|]/;
    // 如果有选中文字, 则需要判断是否合法
    if (selectText && validName.test(selectText)) {
      throw new PluginError("Invalid file name");
    }
    return selectText;
  }

  function getDateName() {
    return moment().format("Y-MM-DD-HH-mm-ss");
  }
}

function getFileDir() {
  return config.fileDir;
}

function saveImage(fileDir, fileName) {
  mkdir(fileDir);
  clipboard.saveImage(fileDir, fileName);
  return;
  function mkdir(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}

// 在markdown中渲染的形式
function render(basePath, filePath) {
  if (basePath) {
    filePath = path.relative(basePath, filePath);
  }
}

class PluginError {
  constructor(message) {
    this.message = message;
    this.name = "PluginError";
  }
}

module.exports = {
  main,
};
