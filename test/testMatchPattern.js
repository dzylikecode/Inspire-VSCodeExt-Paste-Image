const regOp = /[|\\{}()[\]^$+*?.]/g;
const escapeReg = (str) => str.replace(regOp, "\\$&");
const renderPattern = "![](${imagePath})";
const excapedPattern = escapeReg(renderPattern);
// const matchPattern = excapedPattern.replace(/\\\$\\\{(.*?)\\\}/g, "(.*?)");
const matchPattern = excapedPattern.replace(
  /\\\$\\\{(.*?)\\\}/g,
  // "(?<$&>.*?)"
  (match, p1) => `(?<${p1}>.*?)`
);
const matchReg = new RegExp(matchPattern, "g");
console.log(excapedPattern);
console.log(matchReg);

const testLink = "![](assets/2023-09-21-11-29-39.drawio.svg)";
const match = matchReg.exec(testLink);
console.log(match);
console.log(match.groups["imagePath"]);

/// for function

function convertPatternToReg(pattern) {
  const regOp = /[|\\{}()[\]^$+*?.]/g;
  const excapedPattern = escapeReg(pattern);
  const matchPattern = excapedPattern.replace(
    /\\\$\\\{(.*?)\\\}/g,
    // "(?<$&>.*?)"
    (match, p1) => `(?<${p1}>.*?)`
  );
  return new RegExp(matchPattern, "g");
}
