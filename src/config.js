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
      return vscode.workspace.workspaceFolders[0].uri.fsPath;
    },
  },
];
let fileDirConfig;
let baseDirConfig;
let scriptDir;
let testImgScript;
let saveImgScriptName;
const pngImgScriptName = "winPNGfromClipboard.ps1";
const jpgImgScriptName = "winJPGfromClipboard.ps1";
let saveImgScript;
let extensionPath;
let fileExt;
let compressEnable;
let compressThreshold;
///////////////////////////////////////

function init(context) {
  fileDirConfig = vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
  baseDirConfig =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
  extensionPath = context.extensionPath;
  scriptDir = path.join(extensionPath, "./src/clipboard/");
  fileExt = vscode.workspace.getConfiguration("mdPasteEnhanced")["ImageType"];
  switch (fileExt) {
    case ".png":
      saveImgScriptName = pngImgScriptName;
      break;
    case ".jpg":
      saveImgScriptName = jpgImgScriptName;
      break;
    default:
      vscode.window.showErrorMessage(`Invalid file extension: ${fileExt}`);
      throw new Error(`Invalid file extension: ${fileExt}`);
      break;
  }
  testImgScript = path.join(scriptDir, "winTestImage.ps1");
  saveImgScript = path.join(scriptDir, saveImgScriptName);
  compressEnable =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["compressEnable"];
  compressThreshold =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["compressThreshold"] *
    1024;
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
  get saveImgScriptName() {
    return saveImgScriptName;
  },
  get saveImgScript() {
    return saveImgScript;
  },
  get fileDir() {
    return calcPathVariables(fileDirConfig);
  },
  get baseDir() {
    return calcPathVariables(baseDirConfig);
  },
  get extensionPath() {
    return extensionPath;
  },
  get fileExt() {
    return fileExt;
  },
  get compressEnable() {
    return compressEnable;
  },
  get compressThreshold() {
    return compressThreshold;
  },
  get renderPattern() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced")[
      "renderPattern"
    ];
  },
  get isExperimented() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced")[
      "experimentEnable"
    ];
  },
};
