const spawn = require("child_process").spawn;
const vscode = require("vscode");
const path = require("path");

class ClipboardWin {
  constructor() {}
  async isImage() {
    const powershell = spawn("powershell", [
      "-noprofile",
      "-command",
      "if(Get-Clipboard -Format Image){1}else{0}",
    ]);
    const result = await getResult(powershell);
    return isFalse(result) ? false : true;

    async function getResult(task) {
      let data = "";
      for await (const chunk of task.stdout) {
        data += chunk;
      }
      return data;
    }
    function isFalse(taskOut) {
      return taskOut[0] == "0";
    }
  }
  saveImage(filePath) {
    const { dir: fileDir, base: fileName } = path.parse(filePath);
    return new Promise((resolve, reject) => {
      spawn(
        "powershell",
        [
          "-noprofile",
          "-command",
          `(Get-Clipboard -Format Image).save("${fileName}")`,
        ],
        {
          cwd: fileDir,
        }
      )
        .on("error", (e) => vscode.window.showInformationMessage(e.message))
        .on("close", resolve);
    });
  }
}

module.exports = ClipboardWin;
