const spawn = require("child_process").spawn;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

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
  blitImage(filePath) {
    const { ext } = path.parse(filePath);
    const workspaceDir = __dirname;
    const tempFileName = "temp" + ext;
    const tempFileFullPath = path.join(workspaceDir, tempFileName);
    return new Promise((resolve, reject) => {
      spawn(
        "powershell",
        [
          "-noprofile",
          "-command",
          `(Get-Clipboard -Format Image).save("${tempFileName}")`,
        ],
        {
          cwd: workspaceDir,
        }
      )
        .on("error", (e) => vscode.window.showInformationMessage(e.message))
        .on("close", () =>
          // write file to the dest file
          fs.readFile(tempFileFullPath, { encoding: "binary" }, (err, data) => {
            if (err) {
              reject(err);
            } else {
              fs.writeFile(filePath, data, { encoding: "binary" }, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          })
        );
    });
  }
}

module.exports = ClipboardWin;
