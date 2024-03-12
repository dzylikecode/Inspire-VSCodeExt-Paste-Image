const vscode = require("vscode");
const path = require("path");
const spawn = require("child_process").spawn;
const config = require("./config.js");
const clipboard = require("./clipboard/index.js");

function registerServe(context) {
  // Register the markdown preview hover provider
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: "file" }, // for all files
      new MarkdownPreviewHoverProvider()
    )
  );
  // subscribe a command
  context.subscriptions.push(
    vscode.commands.registerCommand("md-paste-enhanced.deleteFile", deleteFile)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("md-paste-enhanced.editFile", editFile)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("md-paste-enhanced.createFile", createFile)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "md-paste-enhanced.createEmptyFile",
      createEmptyFile
    )
  );

  async function deleteFile(filePath) {
    const uri = vscode.Uri.file(filePath);
    try {
      const confirmed = await vscode.window.showInformationMessage(
        `Are you sure you want to delete ${path.basename(filePath)}?`,
        "Yes",
        "No"
      );
      if (confirmed !== "Yes") {
        return;
      }
      await vscode.workspace.fs.delete(uri);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  }

  async function editFile(filePath) {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    // return spawn(
    //   config.editSoftware.command,
    //   // [...config.editSoftware.args, fileName],
    //   [fileName],
    //   {
    //     cwd: fileDir,
    //     shell: true,
    //   }
    // ).on("error", (e) => vscode.window.showInformationMessage(e.message));
    const cmd = config.editMap.find((item) => {
      return item.exts.find((ext) => fileName.endsWith(ext));
    });
    if (!cmd) {
      vscode.window.showInformationMessage(`No edit software for ${fileName}`);
      return;
    }
    const task = new vscode.Task(
      { type: "shell" },
      vscode.TaskScope.Workspace,
      "edit",
      "mdPasteEnhanced",
      // how to deal with `Start-Process \"mspaint\" -ArgumentList \"d:\code\Inspire-VSCodeExt-Paste-Image\test\hello world\2023-09-21-11-25-32.png\"`?
      new vscode.ShellExecution(
        // `Start-Process '${cmd.exeName}' -ArgumentList '${cmd
        //   .parseArgs(filePath)
        //   .join(" ")}'`
        cmd.exeName,
        cmd.parseArgs(filePath)
        // {
        //   cwd: fileDir,
        // }
      )
    );
    return await vscode.tasks.executeTask(task);
  }

  async function createEmptyFile(filePath) {
    const uri = vscode.Uri.file(filePath);
    try {
      if (await fileExists(filePath)) {
        vscode.window.showInformationMessage(
          `File already exists: ${filePath}`
        );
        return;
      }
      await vscode.workspace.fs.writeFile(uri, Buffer.from(""));
      console.log(`Created file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to create file: ${filePath}`, error);
    }
  }

  async function createFile(filePath) {
    const uri = vscode.Uri.file(filePath);
    try {
      if (await fileExists(filePath)) {
        vscode.window.showInformationMessage(
          `File already exists: ${filePath}`
        );
        return;
      }
      if (await clipboard.isImage()) {
        const savePath = await clipboard.saveImage(filePath);
        return;
      } else {
        await vscode.workspace.fs.writeFile(uri, Buffer.from(""));
      }
      console.log(`Created file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to create file: ${filePath}`, error);
    }
  }
}

class MarkdownPreviewHoverProvider {
  async provideHover(document, position) {
    // Check if the current position is within an image tag
    const line = document.lineAt(position.line);
    const imageRegex = config.matchPattern;
    const match = imageRegex.exec(line.text);
    if (!match || !match.groups["imagePath"]) {
      return null;
    }
    const imageFilePath = match.groups["imagePath"];
    if (isRemotePath(imageFilePath)) {
      return null;
    }

    // Create a hover with the image preview
    const imagePath = getFilePath(imageFilePath);
    const imagePreview = new vscode.MarkdownString(
      //   `![${imagePath}](${imagePath}|height=${100}) <br> [Delete](${deleteFile()} "Delete Image")`
      `${
        (await fileExists(imagePath))
          ? `[Edit](${editFile(
              imagePath
            )} "Edit Image") | [Delete](${deleteFile(
              imagePath
            )} "Delete Image")`
          : `[Create](${createFile(
              imagePath
            )} 'Create Image') | [Create Empty](${createEmptyFile(
              imagePath
            )} 'Create Empty File')`
      }`
    );
    imagePreview.isTrusted = true;
    const hover = new vscode.Hover(imagePreview);

    return hover;

    function deleteFile(uri) {
      const args = [uri];
      return vscode.Uri.parse(
        `command:md-paste-enhanced.deleteFile?${encodeURIComponent(
          JSON.stringify(args)
        )}`
      );
    }

    function editFile(uri) {
      const args = [uri];
      return vscode.Uri.parse(
        `command:md-paste-enhanced.editFile?${encodeURIComponent(
          JSON.stringify(args)
        )}`
      );
    }

    function createEmptyFile(uri) {
      const args = [uri];
      return vscode.Uri.parse(
        `command:md-paste-enhanced.createEmptyFile?${encodeURIComponent(
          JSON.stringify(args)
        )}`
      );
    }

    function createFile(uri) {
      const args = [uri];
      return vscode.Uri.parse(
        `command:md-paste-enhanced.createFile?${encodeURIComponent(
          JSON.stringify(args)
        )}`
      );
    }

    function getFilePath(filePath) {
      const curDir = path.dirname(document.uri.fsPath);
      return path.join(curDir, filePath);
    }
  }
}

function isRemotePath(filePath) {
  return filePath.startsWith("http://") || filePath.startsWith("https://");
}

// check file exist
async function fileExists(uri) {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(uri));
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { registerServe };
