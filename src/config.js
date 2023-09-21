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
    this.editMap = getEditMap();

    function getEditMap() {
      /**@type {string[]} */
      const cmds =
        vscode.workspace.getConfiguration("mdPasteEnhanced")["editMap"];
      return cmds.map(parseCmd);
      /**
       *
       * @param {string} command
       */
      function parseCmd(command) {
        const part = /(?:[^\s"]+|"[^"]*")+/g;
        const [exeName, ...args] = command.match(part);
        // get file extension such as *.svg *.png
        // const regName = /(\*\.[^\s]+)/g;
        // /**@type {string[]} */
        // const exts = [];
        // const args = Rest.replace(regName, (match, p1) => {
        //   exts.push(p1.slice(1));
        //   return "";
        // });
        const exts = args
          .filter((arg) => arg.startsWith("*"))
          .map((arg) => arg.slice(1));
        return {
          exeName: exeName.replace(/^"|"$/g, ""),
          args,
          exts,
          parseArgs,
        };
        function parseArgs(fileName) {
          return args.map((arg) => {
            if (!arg.startsWith("*")) return arg;
            const ext = arg.slice(1);
            return fileName.endsWith(ext) ? `"${fileName}"` : "";
          });
        }
      }
    }
  }
  get fileDir() {
    return calcPathVariables(this.fileDirConfig);
  }
  get baseDir() {
    return calcPathVariables(this.baseDirConfig);
  }
}

module.exports = new Config();
