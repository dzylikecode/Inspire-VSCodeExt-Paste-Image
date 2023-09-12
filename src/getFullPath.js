const vscode = require("vscode");
const config = require("./config.js");
const moment = require("moment");
const PluginError = require("./error.js");
const path = require("path");

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

function getDefaultFileDir() {
  return config.fileDir;
}

function confirmName(defaultName) {
  return vscode.window.showInputBox({
    prompt: "Please input file name",
    value: defaultName,
  });
}

function confirmFullPath(defaultFullPath) {
  return vscode.window.showInputBox({
    prompt: "Please input full path",
    value: defaultFullPath,
  });
}

async function getFullPath(confirmPattern, fileExt) {
  const defaultName = getDefaultName();
  const defaultDir = getDefaultFileDir();
  const defaultFullPath = path.format({
    dir: defaultDir,
    name: defaultName,
    ext: fileExt,
  });
  if (confirmPattern == "None") {
    return defaultFullPath;
  } else if (confirmPattern == "Just Name") {
    const nameConfirmed = await confirmName(defaultName);
    return path.format({
      dir: defaultDir,
      name: nameConfirmed,
      ext: fileExt,
    });
  } else if (confirmPattern == "Full Path") {
    const fullPathConfirmed = await confirmFullPath(defaultFullPath);
    return path.normalize(fullPathConfirmed);
  }
  return "";
}

module.exports = getFullPath;
