const vscode = require("vscode");
const path = require("path");
const spawn = require("child_process").spawn;
const config = require("./config.js");

function registerServe(context) {
  // Register the markdown preview hover provider
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: "file", language: "markdown" },
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

  async function deleteFile(filePath) {
    const uri = vscode.Uri.file(filePath);
    try {
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
    const task = new vscode.Task(
      { type: "shell" },
      vscode.TaskScope.Workspace,
      "edit",
      "mdPasteEnhanced",
      new vscode.ShellExecution(
        `Start-Process \\"${
          config.editSoftware.command
        }\\" -ArgumentList \\"${config.editSoftware.args.join(
          " "
        )} ${fileName}\\"`,
        {
          cwd: fileDir,
        }
      )
    );
    return await vscode.tasks.executeTask(task);
  }
}

class MarkdownPreviewHoverProvider {
  async provideHover(document, position) {
    // Check if the current position is within an image tag
    const line = document.lineAt(position.line);
    const imageRegex = /!\[.*\]\((.*)\)/g;
    const match = imageRegex.exec(line.text);
    if (!match || !match[1]) {
      return null;
    }

    // Create a hover with the image preview
    const imagePath = getFilePath(match[1]);
    const imagePreview = new vscode.MarkdownString(
      //   `![${imagePath}](${imagePath}|height=${100}) <br> [Delete](${deleteFile()} "Delete Image")`
      `${
        (await fileExists(imagePath))
          ? `[Edit](${editFile(
              imagePath
            )} "Edit Image") | [Delete](${deleteFile(
              imagePath
            )} "Delete Image")`
          : "not found"
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

    function getFilePath(filePath) {
      const curDir = path.dirname(document.uri.fsPath);
      return path.join(curDir, filePath);
    }
  }
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
