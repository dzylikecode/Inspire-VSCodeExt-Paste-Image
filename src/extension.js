const vscode = require("vscode");
const main = require("./main.js");
const logger = require("./logger.js");

async function activate(context) {
  logger.log("md-paste-image activate");
  let disposable = vscode.commands.registerCommand(
    "md-paste-enhanced.paste",
    function () {
      try {
        main.main(context);
      } catch (e) {
        vscode.window.showInformationMessage(e);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {
  logger.close();
}

module.exports = {
  activate,
  deactivate,
};
