const { spawn } = require("child_process");
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

class ClipboardMac {
  constructor() {}

  async isImage() {
    const applescript = spawn("osascript", [
      "-e",
      `
      try
        set clipboardImage to the clipboard as «class PNGf»
        return "1"
      on error
        return "0"
      end try
      `,
    ]);
    const result = await getResult(applescript);
    return isFalse(result) ? false : true;

    async function getResult(task) {
      let data = "";
      for await (const chunk of task.stdout) {
        data += chunk;
      }
      return data.trim();
    }

    function isFalse(taskOut) {
      return taskOut === "0";
    }
  }

  saveImage(filePath) {
    return new Promise((resolve, reject) => {
      const script = `
      try
        set clipboardImage to the clipboard as «class PNGf»
        set fileHandle to open for access POSIX file "${filePath}" with write permission
        write clipboardImage to fileHandle
        close access fileHandle
      on error errMsg
        do shell script "echo " & errMsg & " > /dev/stderr"
      end try
      `;

      const applescript = spawn("osascript", ["-e", script]);

      applescript.on("error", (e) => vscode.window.showInformationMessage(e.message));
      applescript.on("close", resolve);
    });
  }

  blitImage(filePath) {
    const { ext } = path.parse(filePath);
    const workspaceDir = __dirname;
    const tempFileName = "temp" + ext;
    const tempFileFullPath = path.join(workspaceDir, tempFileName);

    return new Promise((resolve, reject) => {
      const script = `
      try
        set clipboardImage to the clipboard as «class PNGf»
        set tempFile to POSIX path of "${tempFileFullPath}"
        set fileHandle to open for access POSIX file tempFile with write permission
        write clipboardImage to fileHandle
        close access fileHandle
        do shell script "mv " & quoted form of tempFile & " " & quoted form of "${filePath}"
      on error errMsg
        do shell script "echo " & errMsg & " > /dev/stderr"
      end try
      `;

      const applescript = spawn("osascript", ["-e", script]);

      applescript.on("error", (e) => vscode.window.showInformationMessage(e.message));
      applescript.on("close", resolve);
    });
  }
}

module.exports = ClipboardMac;
