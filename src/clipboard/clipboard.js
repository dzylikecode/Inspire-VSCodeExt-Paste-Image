const spawn = require("child_process").spawn;
const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
const config = require("../config.js");
const isWsl = require("is-wsl");
function Clipboard() {
  const platform = process.platform;
  if (platform == "win32") {
    this.isImage = isImageWin;
    this.saveImageCore = saveImageWin;
  } else if (isWsl) {
    this.isImage = isImageWin;
    this.saveImageCore = saveImageWSL;
  }
  this.saveImage = async (fileDir, fileName) => {
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
    this.saveImageCore(fileDir, fileName);
  };
}
async function isImageWin() {
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

async function saveImageWin(fileDir, fileName) {
  spawn(
    "powershell",
    ["-executionpolicy", "ByPass", "-File", config.saveImgScript, fileName],
    {
      cwd: fileDir,
    }
  ).on("error", (e) => vscode.window.showInformationMessage(e.message));
}

async function saveImageWSL(fileDir, fileName) {
  // powershell 不能识别wsl的路径, 所以先转到ps1脚本工作, 然后移动文件到目标文件夹下
  spawn(
    "powershell.exe",
    ["-executionpolicy", "ByPass", "-File", config.saveImgScriptName, fileName],
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

module.exports = new Clipboard();
