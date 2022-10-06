const spawn = require("child_process").spawn;
const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
const config = require("../config.js");

async function isImage() {
  let powershell = spawn("powershell", [config.testImgScript]);
  let data = "";
  for await (const chunk of powershell.stdout) {
    data += chunk;
  }
  if (data[0] == "0") {
    return false;
  }
  return true;
}

async function saveImage(fileDir, fileName) {
  let filePath = path.join(fileDir, fileName);
  if (fs.existsSync(filePath)) {
    let choose = await vscode.window.showInformationMessage(
      `File ${filePath} existed.Would you want to replace?`,
      "Replace",
      "Cancel"
    );
    if (choose == "Cancel") {
      return;
    }
  }
  let platform = process.platform;
  if (platform == "win32") {
    spawn(
      "powershell",
      ["-executionpolicy", "ByPass", "-File", config.saveImgScript, fileName],
      {
        cwd: fileDir,
      }
    ).on("error", (e) => vscode.window.showInformationMessage(e.message));
  } else if (platform == "linux") {
    // 可以使用 wsl.exe 测试是否是 wsl, 以区分真正的Linux
    // powershell 不能识别wsl的路径, 所以先转到ps1脚本工作, 然后移动文件到目标文件夹下
    spawn(
      "powershell.exe",
      [
        "-executionpolicy",
        "ByPass",
        "-File",
        config.saveImgScriptName,
        fileName,
      ],
      {
        cwd: config.scriptDir,
      }
    )
      .on("error", (e) => vscode.window.showInformationMessage(e.message))
      .on("close", () =>
        spawn("mv", [fileName, fileDir], {
          cwd: config.scriptDir,
        })
      );
  }
}

module.exports = {
  isImage,
  saveImage,
};
