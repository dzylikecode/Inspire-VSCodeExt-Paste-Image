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
let scriptDir;
let testImgScript;
const saveImgScriptName = "winPNGfromClipboard.ps1";
let saveImgScript;
///////////////////////////////////////

function init(context) {
  fileDirConfig = vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
  baseDirConfig =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
  let extensionPath = context.extensionPath;
  scriptDir = path.join(extensionPath, "./src/clipboard/");
  testImgScript = path.join(scriptDir, "winTestImage.ps1");
  saveImgScript = path.join(scriptDir, saveImgScriptName);
}

function calcPathVariables(patternString) {
  for (const pattern of variablePatterns) {
    patternString = patternString.replace(pattern.pattern, pattern.value);
  }
  return patternString;
}

module.exports = {
  init,
  get scriptDir() {
    return scriptDir;
  },
  get testImgScript() {
    return testImgScript;
  },
  saveImgScriptName,
  get saveImgScript() {
    return saveImgScript;
  },
  get fileDir() {
    return calcPathVariables(fileDirConfig);
  },
  get baseDir() {
    return calcPathVariables(baseDirConfig);
  },
};
