const { spawn } = require("child_process");
const path = require("path");
async function editFile(filePath) {
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  const software = "D:\\Program Files\\draw.io\\draw.io.exe";
  const args = [fileName];
  const options = { cwd: fileDir };
  const child = spawn(software, args, options);
  child.on("error", (err) => {
    console.error(err);
  });
  child.on("exit", (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
  });
}

editFile("assets/2023-09-21-11-29-39.drawio.svg");
