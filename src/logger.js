const vscode = require("vscode");
const moment = require("moment");
function Logger() {
  this.channel = vscode.window.createOutputChannel("Paste Image");
  this.log = (msg) => {
    if (this.channel) {
      let time = moment().format("MM-DD HH:mm:ss");
      this.channel.appendLine(`[${time}] ${msg}`);
    }
  };
  this.close = () => this.channel.dispose();
}

module.exports = new Logger();
