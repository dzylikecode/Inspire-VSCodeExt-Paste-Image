const vscode = require("vscode");
const main = require("./main.js");
const config = require("./config.js");
const compress = require("./compress.js");

async function activate(context) {
  config.init(context);
  await compress.init();
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
