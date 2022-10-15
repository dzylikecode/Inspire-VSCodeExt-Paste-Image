/*jslint esversion: 11*/

// import imagemin from "imagemin";
// import imageminPngquant from "imagemin-pngquant";
// const imagemin = require("imagemin");
// const imageminPngquant = require("imagemin-pngquant");

const fs = require("fs");
// https://github.com/imagemin/imagemin-pngout

let imagemin;
const imageminPngout = require("../imagemin-pngout");

async function compressPNG(destDir, sourceFileList) {
  await imagemin(sourceFileList, {
    destination: destDir,
    plugins: [imageminPngout()],
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
  compressPNG,
  getFilesizeInBytes,
};
