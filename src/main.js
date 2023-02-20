const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard/clipboard.js");
const fs = require("fs");
const path = require("path");
const compress = require("./compress.js");
const logger = require("./logger.js");
const getFullPath = require("./getFullPath.js");

async function main(context) {
  config.init(context);
  let clipContent = await vscode.env.clipboard.readText(); // 提升速度, 有文件则不用判断是否为图片
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
  const { dir: fileDir, base: fileName } = path.parse(filePath);
  render(config.baseDir, filePath); // 先渲染出来
  const savePath = await saveImage(fileDir, fileName);
  if (config.compressEnable) {
    const fileSize = compress.getFilesizeInBytes(savePath);
    if (fileSize > config.compressThreshold) {
      compressFile(fileDir, savePath);
    }
  }
}

function saveImage(fileDir, fileName) {
  mkdir(fileDir);
  return clipboard.saveImage(fileDir, fileName);
  function mkdir(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}

// 在markdown中渲染的形式
function render(basePath, filePath) {
  if (basePath) {
    filePath = path.relative(basePath, filePath).replace(/\\/g, "/");
  }
  filePath = encodeURI(filePath);
  let imageLink = getImageLink(filePath);
  // vscode.env.clipboard.writeText(imageLink); // 似乎会打断saveImage的执行, 提早改变剪切板, 除非用await
  // vscode.commands.executeCommand("editor.action.clipboardPasteAction");
  let editor = vscode.window.activeTextEditor;
  editor.edit((edit) => {
    let current = editor.selection;

    if (current.isEmpty) {
      edit.insert(current.start, imageLink);
    } else {
      edit.replace(current, imageLink);
    }
  });
  return;
  function getImageLink(imagePath) {
    let renderPattern = config.renderPattern;
    return replaceVariables(renderPattern);
    function replaceVariables(pattern) {
      return pattern.replace(/\$\{imagePath\}/g, (match, src) => {
        return imagePath;
      });
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
