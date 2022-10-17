/*jslint esversion:11 */

const fs = require("fs");
// https://github.com/imagemin/imagemin-pngout

// const imageminPngout = require("../imagemin-pngout");
const imageminPngquant = require("../imagemin-pngquant");
const imageminJpegtran = require("../imagemin-jpegtran");
const logger = require("./logger.js");
const imagemin = require("../imagemin-dist/imagemin.js").default;

async function compressIMG(destDir, sourceFileList) {
  await imagemin(sourceFileList, {
    destination: destDir,
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
      imageminJpegtran(),
    ],
  });
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
