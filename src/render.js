const path = require("path");
const vscode = require("vscode");
const config = require("./config.js");

// 在markdown中渲染的形式
function render(basePath, filePath) {
  if (basePath) {
    filePath = path.relative(basePath, filePath).replace(/\\/g, "/");
  }
  filePath = encodeURI(filePath);
  const imageLink = getImageLink(filePath);
  // vscode.env.clipboard.writeText(imageLink); // 似乎会打断saveImage的执行, 提早改变剪切板, 除非用await
  // vscode.commands.executeCommand("editor.action.clipboardPasteAction");
  const editor = vscode.window.activeTextEditor;
  editor.edit((edit) => {
    const current = editor.selection;

    if (current.isEmpty) {
      edit.insert(current.start, imageLink);
    } else {
      edit.replace(current, imageLink);
    }
  });
  return;
  function getImageLink(imagePath) {
    let renderPattern = config.renderPattern;
    return replaceVariables(renderPattern);
    function replaceVariables(pattern) {
      return pattern.replace(/\$\{imagePath\}/g, (match, src) => {
        return imagePath;
      });
    }
  }
}

module.exports = render;
