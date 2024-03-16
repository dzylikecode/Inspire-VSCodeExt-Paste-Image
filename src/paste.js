const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard/index.js");
const getFullPath = require("./getFullPath.js");
const render = require("./render.js");

async function paste() {
  const clipContent = await vscode.env.clipboard.readText(); // 提升速度, 有文字则不用判断是否为图片
  if (clipContent == "" && (await clipboard.isImage())) {
    try {
      await pasteImage();
    } catch (e) {
      vscode.window.showInformationMessage(e);
    }
  } else {
    if (vscode.window.activeTextEditor.selection.isEmpty == false) {
      try {
        await vscode.commands.executeCommand(
          "markdown.extension.editing.paste"
        ); // 兼容 markdown all in one
      } catch (e) {
        await vscode.commands.executeCommand(
          "editor.action.clipboardPasteAction"
        );
      }
    } else {
      await vscode.commands.executeCommand(
        "editor.action.clipboardPasteAction"
      );
    }
  }
}

async function pasteImage() {
  const filePath = await getFullPath(config.confirmPattern, config.pasteExt);
  render(config.baseDir, filePath); // 先渲染出来
  const savePath = await clipboard.saveImage(filePath);
}

module.exports = {
  paste,
};
