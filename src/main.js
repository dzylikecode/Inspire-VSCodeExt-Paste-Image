const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard");
const getFullPath = require("./getFullPath.js");
const render = require("./render.js");
const compress = require("./compress.js");
const logger = require("./logger.js");
const path = require("path");

async function main(context) {
  config.init(context);
  const clipContent = await vscode.env.clipboard.readText(); // 提升速度, 有文字则不用判断是否为图片
  if (clipContent == "" && (await clipboard.isImage())) {
    try {
      pasteImage();
    } catch (e) {
      vscode.window.showInformationMessage(e);
    }
  } else {
    if (vscode.window.activeTextEditor.selection.isEmpty == false) {
      try {
        vscode.commands.executeCommand("markdown.extension.editing.paste"); // 兼容 markdown all in one
      } catch (e) {
        vscode.commands.executeCommand("editor.action.clipboardPasteAction");
      }
    } else {
      vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    }
  }
}

async function pasteImage() {
  const filePath = await getFullPath(config.confirmPattern);
  render(config.baseDir, filePath); // 先渲染出来
  const savePath = await clipboard.saveImage(filePath);
  if (config.compressEnable) {
    const fileSize = compress.getFilesizeInBytes(savePath);
    if (fileSize > config.compressThreshold) {
      compressFile(path.dirname(savePath), savePath);
    }
  }
}

async function compressFile(destDir, sourceFile) {
  let fileSize = compress.getFilesizeInBytes(sourceFile);
  logger.log(sourceFile);
  logger.log(`before fileSize: ${fileSize}`);
  try {
    await compress.compressIMG(destDir, [sourceFile]);
  } catch (e) {
    logger.log(e);
  }
  let fileName = path.basename(sourceFile);
  let destFile = path.join(destDir, fileName);
  fileSize = compress.getFilesizeInBytes(destFile);
  logger.log(`after fileSize: ${fileSize}`);
}

module.exports = {
  main,
};
