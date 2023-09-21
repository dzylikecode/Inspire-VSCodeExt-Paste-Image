const vscode = require("vscode");
const { paste } = require("./paste.js");
const logger = require("./logger.js");
const deleteFileServe = require("./hoverMenu.js");
const config = require("./config.js");
const { create } = require("./createFile.js");

async function activate(context) {
  logger.log("md-paste-image activate");
  config.loadConfig(context);
  vscode.workspace.onDidChangeConfiguration(() => config.loadConfig(context));
  let disposable = vscode.commands.registerCommand(
    "md-paste-enhanced.paste",
    function () {
      try {
        paste();
      } catch (e) {
        vscode.window.showInformationMessage(e);
      }
    }
  );

  context.subscriptions.push(disposable);

  deleteFileServe.registerServe(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("md-paste-enhanced.create", create)
  );
}

function deactivate() {
  logger.close();
}

module.exports = {
  activate,
  deactivate,
};
