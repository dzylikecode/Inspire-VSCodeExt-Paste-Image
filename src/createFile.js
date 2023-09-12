const vscode = require("vscode");
const config = require("./config.js");
const getFullPath = require("./getFullPath.js");
const render = require("./render.js");

async function create() {
  const filePath = await getFullPath(config.confirmPattern, config.createExt);
  render(config.baseDir, filePath); // 先渲染出来
  // create empty
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(filePath),
    Buffer.from("")
  );
}

module.exports = {
  create,
};
