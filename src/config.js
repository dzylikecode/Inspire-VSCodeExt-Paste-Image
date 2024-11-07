const vscode = require("vscode");
const path = require("path");
const { minimatch } = require("minimatch");
const { calcPathVariables } = require("./builtInVar.js");

class Config {
  constructor() {}
  loadConfig(context) {
    this.extensionPath = context.extensionPath;
  }
  get fileDirConfig() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["path"];
  }
  get baseDirConfig() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["basePath"];
  }
  get defaultName() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["defaultName"];
  }
  get pasteExt() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["ImageType"];
  }
  get createExt() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["createFileExt"];
  }
  get renderPatternDeprecated() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["renderPattern"];
  }
  get confirmPattern() {
    return vscode.workspace.getConfiguration("mdPasteEnhanced", vscode.window.activeTextEditor.document)["confirmPattern"];
  }
  get renderMap() {
    return getRenderPattern();
  }
  get editMap() {
    return getEditMap();
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

    // Apply the replacement so that \n is converted to a real newline
    const pattern = matchedPattern?.renderPattern ?? this.renderPatternDeprecated;
    return pattern.replace(/\\n/g, '\n');
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
  // Define a regular expression to escape special regex characters
  const regOp = /[|\\{}()[\]^$+*?.]/g;
  
  // Escape special characters in the pattern, so it can be safely converted to a regex
  const escapedPattern = pattern.replace(regOp, "\\$&");
  
  // Replace placeholders like ${imagePath} with named capturing groups in the regex.
  // Using `.*` (instead of non-greedy `.*?`) allows the match to extend to the end of the line,
  // ensuring that paths or other elements are fully captured even if they are longer.
  const matchPattern = escapedPattern.replace(
    /\\\$\\\{(.*?)\\\}/g,
    (match, p1) => `(?<${p1}>.*)` // Greedy match to capture complete path
  ).replace(/image::\s*/, "image::\\s*"); // Make space after "image::" optional
  
  // Return the constructed regular expression
  return new RegExp(matchPattern, "g");
}


module.exports = new Config();
