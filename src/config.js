const vscode = require("vscode");
let filePath;
let bathPath;

function init() {
  filePath = vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
  bathPath = vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
}

module.exports = {
  init,
  filePath,
  bathPath,
};
