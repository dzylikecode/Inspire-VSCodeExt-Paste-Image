const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard/clipboard.js");
// const clipboard = require("./clipboard/clipboard.js"); es6 module not supported
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const compress = require("./compress.js");
const logger = require("./logger.js");

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
  const fileName = await getFileName();
  const fileDir = getFileDir();
  const filePath = path.join(fileDir, fileName);
  render(config.baseDir, filePath); // 先渲染出来
  const savePath = await saveImage(fileDir, fileName);
  if (config.compressEnable) {
    const fileSize = compress.getFilesizeInBytes(savePath);
    if (fileSize > config.compressThreshold) {
      compressFile(fileDir, savePath);
    }
  }
}

function getDefaultName() {
  return getSelectText() || getDateName();

  function getSelectText() {
    const editor = vscode.window.activeTextEditor;
    const selectText = editor.document.getText(editor.selection);
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

function getConfirmName(defaultName) {
  return vscode.window.showInputBox({
    prompt: "Please input file name",
    value: defaultName,
  });
}

async function getFileName() {
  const defaultName = getDefaultName();
  const name = config.showFilePathConfirmInputBox
    ? await getConfirmName(defaultName)
    : defaultName;
  return name + config.fileExt;
}

function getFileDir() {
  return config.fileDir;
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

class PluginError {
  constructor(message) {
    this.message = message;
    this.name = "PluginError";
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
