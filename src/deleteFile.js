const vscode = require("vscode");
const path = require("path");

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

  async function deleteFile(filePath) {
    const uri = vscode.Uri.file(filePath);
    try {
      await vscode.workspace.fs.delete(uri);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
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
          ? `[Delete](${deleteFile(imagePath)} "Delete Image")`
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
