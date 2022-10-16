const vscode = require("vscode");
const main = require("./main.js");

async function activate(context) {
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

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
