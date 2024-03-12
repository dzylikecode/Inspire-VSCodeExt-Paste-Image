const vscode = require("vscode");
const path = require("path");
const defaultVar = "";
const theVars = {
  get currentFileDir() {
    const editor = vscode.window.activeTextEditor;
    const filePath = editor.document.uri.fsPath;
    return path.dirname(filePath);
  },
  get projectRoot() {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  },
  get currentFileName() {
    const editor = vscode.window.activeTextEditor;
    const filePath = editor.document.uri.fsPath;
    return path.basename(filePath);
  },
  get currentFileNameWithoutExt() {
    const editor = vscode.window.activeTextEditor;
    const filePath = editor.document.uri.fsPath;
    return path.basename(filePath, path.extname(filePath));
  },
};

/**
 *
 * @param {string} patternString
 * @param {*} context
 */
function calcPathVariables(patternString, context = {}) {
  const realPath = patternString.replace(
    /\$\{(.*?)\}/g,
    (match, varName) => context[varName] ?? theVars[varName] ?? defaultVar
  );
  return path.normalize(realPath);
}

module.exports = { calcPathVariables };
