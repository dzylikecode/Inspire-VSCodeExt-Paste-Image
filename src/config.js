const vscode = require("vscode");
const path = require("path");

let fileDirConfig;
let baseDirConfig;
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
  fileExt = vscode.workspace.getConfiguration("mdPasteEnhanced")["ImageType"];
  switch (fileExt) {
    case ".png":
      break;
    case ".jpg":
      break;
    default:
      vscode.window.showErrorMessage(`Invalid file extension: ${fileExt}`);
      throw new Error(`Invalid file extension: ${fileExt}`);
  }
  compressEnable =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["compressEnable"];
  compressThreshold =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["compressThreshold"] *
    1024;
}

function calcPathVariables(patternString) {
  const variablePatterns = [
    {
      pattern: /\$\{currentFileDir\}/g,
      get value() {
        const editor = vscode.window.activeTextEditor;
        const filePath = editor.document.uri.fsPath;
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

  for (const pattern of variablePatterns) {
    patternString = patternString.replace(pattern.pattern, pattern.value);
  }
  return path.normalize(patternString);
}

module.exports = {
  init,
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
  get confirmPattern() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced")[
      "confirmPattern"
    ];
  },
};
