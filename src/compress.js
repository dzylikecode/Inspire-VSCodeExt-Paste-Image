const fs = require("fs");
// https://github.com/imagemin/imagemin-pngout

// const imageminPngout = require("../imagemin-pngout");
const imageminPngquant = require("../imagemin-pngquant");
const imageminJpegtran = require("../imagemin-jpegtran");

async function compressIMG(destDir, sourceFileList) {
  const { default: imagemin } = await import("imagemin");
  await imagemin(sourceFileList, {
    destination: destDir,
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
      imageminJpegtran(),
    ],
  });
  console.log("Images optimized");
}

function getFilesizeInBytes(filename) {
  let stats = fs.statSync(filename);
  let fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

module.exports = {
  compressIMG,
  getFilesizeInBytes,
};
