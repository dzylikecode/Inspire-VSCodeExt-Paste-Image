const scriptDir = __dirname;
const spawn = require("child_process").spawn;
const path = require("path");
const testImgScript = path.join(scriptDir, "winTestImage.ps1");

async function isImage() {
  let powershell = spawn("powershell", [testImgScript]);
  let data = "";
  for await (const chunk of powershell.stdout) {
    console.log("stdout chunk: " + chunk);
    data += chunk;
  }
  if (data[0] == "0") {
    return false;
  }
  return true;
}

module.exports = {
  isImage,
};
