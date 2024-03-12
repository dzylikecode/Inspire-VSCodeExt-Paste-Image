const { minimatch } = require("minimatch");

const testUnits = [
  {
    path: "test/testMiniMatch.js",
    pattern: "*.js",
  },
  {
    path: "test\\testMiniMatch.js",
    pattern: "*.js",
  },
  {
    path: "test/testMiniMatch.js",
    pattern: "**/*.js",
  },
  {
    path: "test\\testMiniMatch.js",
    pattern: "**/*.js",
  },
  {
    path: "test/testMiniMatch.js",
    pattern: "**/*",
  },
  {
    path: "test\\testMiniMatch.js",
    pattern: "**/*",
  },
];

for (const { path, pattern } of testUnits) {
  console.log(
    `path: ${path}, pattern: ${pattern} = ${minimatch(path, pattern)}`
  );
}
