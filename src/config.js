const vscode = require("vscode");
const path = require("path");
const { minimatch } = require("minimatch");
const { calcPathVariables } = require("./builtInVar.js");

class Config {
  constructor() {}
  loadConfig(context) {
    this.fileDirConfig =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["path"];
    this.baseDirConfig =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["basePath"];
    this.defaultName =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["defaultName"];
    this.extensionPath = context.extensionPath;
    this.pasteExt =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["ImageType"];
    this.createExt =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["createFileExt"];
    this.renderPatternDeprecated =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["renderPattern"];
    this.renderMap = getRenderPattern();
    this.confirmPattern =
      vscode.workspace.getConfiguration("mdPasteEnhanced")["confirmPattern"];
    this.editMap = getEditMap();
  }
  get fileDir() {
    return calcPathVariables(this.fileDirConfig);
  }
  get baseDir() {
    return calcPathVariables(this.baseDirConfig);
  }
  get renderPattern() {
    const editor = vscode.window.activeTextEditor;
    const filePath = editor.document.uri.fsPath;
    const matchedPattern = this.renderMap.find((item) => {
      return minimatch(filePath, item.matchRule);
    });
    return matchedPattern.renderPattern ?? this.renderPatternDeprecated;
  }

  get matchPattern() {
    return convertPatternToReg(this.renderPattern);
  }
}

function getEditMap() {
  /**@type {string[]} */
  const cmds = vscode.workspace.getConfiguration("mdPasteEnhanced")["editMap"];
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
        return fileName.endsWith(ext) ? `\\"${fileName}\\"` : "";
      });
    }
  }
}

function getRenderPattern() {
  /**@type {string[]} */
  const rawPatterns =
    vscode.workspace.getConfiguration("mdPasteEnhanced")["renderMap"];
  return rawPatterns.map(parsePattern);

  /**
   *
   * @param {string} str
   * @returns
   */
  function parsePattern(str) {
    const parts = str.split("=>");
    const matchRule = parts[0].trim();
    const renderPattern = parts[1].trim();
    return {
      matchRule,
      renderPattern,
    };
  }
}

function convertPatternToReg(pattern) {
  const regOp = /[|\\{}()[\]^$+*?.]/g;
  const excapedPattern = pattern.replace(regOp, "\\$&");
  const matchPattern = excapedPattern.replace(
    /\\\$\\\{(.*?)\\\}/g,
    (match, p1) => `(?<${p1}>.*?)` // group name
  );
  return new RegExp(matchPattern, "g");
}

module.exports = new Config();
