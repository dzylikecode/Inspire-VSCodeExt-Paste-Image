/*jslint esversion: 11*/

const fs = require("fs");
// https://github.com/imagemin/imagemin-pngout

let imagemin;
// const imageminPngout = require("../imagemin-pngout");
const imageminPngquant = require("../imagemin-pngquant");
const imageminJpegtran = require("../imagemin-jpegtran");

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
  console.log("Images optimized");
}

function getFilesizeInBytes(filename) {
  let stats = fs.statSync(filename);
  let fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
async function init() {
  const { default: mImagemin } = await import("imagemin");
  imagemin = mImagemin;
}
module.exports = {
  init,
  compressIMG,
  getFilesizeInBytes,
};
