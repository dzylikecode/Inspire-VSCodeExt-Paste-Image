const vscode = require("vscode");
const path = require("path");
const { config } = require("process");

let fileDirConfig;
let baseDirConfig;
let extensionPath;
let fileExt;
///////////////////////////////////////

function init(context) {
  fileDirConfig = vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
  baseDirConfig =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
  extensionPath = context.extensionPath;
  fileExt = vscode.workspace.getConfiguration("mdPasteEnhanced")["ImageType"];
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
    {
      pattern: /\$\{currentFileName\}/g,
      get value() {
        const editor = vscode.window.activeTextEditor;
        const filePath = editor.document.uri.fsPath;
        return path.basename(filePath);
      },
    },
    {
      pattern: /\$\{currentFileNameWithoutExt\}/g,
      get value() {
        const editor = vscode.window.activeTextEditor;
        const filePath = editor.document.uri.fsPath;
        return path.basename(filePath, path.extname(filePath));
      },
    },
  ];

  for (const pattern of variablePatterns) {
    patternString = patternString.replace(pattern.pattern, pattern.value);
  }
  return path.normalize(patternString);
}

class Config {
  constructor() {}
  loadConfig(context) {
    this.fileDirConfig =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
    this.baseDirConfig =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
    this.extensionPath = context.extensionPath;
    this.pasteExt =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["ImageType"];
    this.createExt =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["createFileExt"];
    this.renderPattern =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["renderPattern"];
    this.confirmPattern =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["confirmPattern"];
  }
  get fileDir() {
    return calcPathVariables(this.fileDirConfig);
  }
  get baseDir() {
    return calcPathVariables(this.baseDirConfig);
  }
}

module.exports = new Config();
