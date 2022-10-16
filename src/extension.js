const vscode = require("vscode");
const main = require("./main.js");
const compress = require("./compress.js");

async function activate(context) {
  await compress.init();
  let disposable = vscode.commands.registerCommand(
    "md-paste-enhanced.paste",
    function () {
      try {
        main.main(context);
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
