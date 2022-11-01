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
    this.isImage = isImageWSL;
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
    await this.saveImageCore(fileDir, fileName);
    return filePath;
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

// 由于执行速度的问题, 将脚本压缩为命令行形式
async function isImageWSL() {
  let powershell = spawn("powershell.exe", [
    "-noprofile",
    "-command",
    "if(Get-Clipboard -Format Image){1}else{0}",
  ]);
  let data = "";
  for await (const chunk of powershell.stdout) {
    data += chunk;
  }
  if (data[0] == "0") {
    return false;
  }
  return true;
}

function saveImageWin(fileDir, fileName) {
  return new Promise((resolve, reject) => {
    spawn(
      "powershell",
      ["-executionpolicy", "ByPass", "-File", config.saveImgScript, fileName],
      {
        cwd: fileDir,
      }
    )
      .on("error", (e) => vscode.window.showInformationMessage(e.message))
      .on("close", resolve);
  });
}

function saveImageWSL(fileDir, fileName) {
  // powershell 不能识别wsl的路径, 所以先转到ps1脚本工作, 然后移动文件到目标文件夹下
  return new Promise((resolve, reject) => {
    spawn(
      "powershell.exe",
      [
        "-noprofile",
        "-command",
        `(Get-Clipboard -Format Image).save("${fileName}")`,
      ],
      {
        cwd: config.scriptDir,
      }
    )
      .on("error", (e) => vscode.window.showInformationMessage(e.message))
      .on("close", () =>
        spawn("mv", [fileName, fileDir], {
          cwd: config.scriptDir,
        }).on("close", resolve)
      );
  });
}

module.exports = new Clipboard();
