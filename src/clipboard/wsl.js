const spawn = require("child_process").spawn;
const fs = require("fs");
const vscode = require("vscode");
const path = require("path");

let powershellCMD = "";

class ClipboardWSL {
  constructor() {
    powershellCMD = this.checkPowershellWSL();
  }
  checkPowershellWSL() {
    const command =
      "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe";
    return fs.existsSync(command) ? command : "powershell.exe";
  }
  // 由于执行速度的问题, 将脚本压缩为命令行形式
  async isImage() {
    const powershell = spawn(powershellCMD, [
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
    const workspaceDir = __dirname;
    // powershell 不能识别wsl的路径, 所以先转到ps1脚本工作, 然后移动文件到目标文件夹下
    return new Promise((resolve, reject) => {
      spawn(
        powershellCMD,
        [
          "-noprofile",
          "-command",
          `(Get-Clipboard -Format Image).save("${fileName}")`,
        ],
        {
          cwd: workspaceDir,
        }
      )
        .on("error", (e) => vscode.window.showInformationMessage(e.message))
        .on("close", () =>
          spawn("mv", [fileName, fileDir], {
            cwd: workspaceDir,
          }).on("close", resolve)
        );
    });
  }
}

module.exports = ClipboardWSL;
