const vscode = require("vscode");
const main = require("./main.js");
const config = require("./config.js");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  config.init(context);
  let disposable = vscode.commands.registerCommand(
    "md-paste-enhanced.paste",
    function () {
      try {
        main.main();
      } catch (e) {
        console.error(e);
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
