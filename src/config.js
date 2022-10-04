const vscode = require("vscode");
const path = require("path");

let variablePatterns = [
  {
    pattern: /\$\{currentFileDir\}/g,
    get value() {
      let editor = vscode.window.activeTextEditor;
      let filePath = editor.document.uri.fsPath;
      return path.dirname(filePath);
    },
  },
  {
    pattern: /\$\{projectRoot\}/g,
    get value() {
      return vscode.workspace.workspaceFolders;
    },
  },
];
let fileDirConfig;
let baseDirConfig;

function init() {
  fileDirConfig = vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
  baseDirConfig =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
}

function calcPathVariables(patternString) {
  for (const pattern of variablePatterns) {
    patternString = patternString.replace(pattern.pattern, pattern.value);
  }
  return patternString;
}

module.exports = {
  init,
  get fileDir() {
    return calcPathVariables(fileDirConfig);
  },
  get baseDir() {
    return calcPathVariables(baseDirConfig);
  },
};
