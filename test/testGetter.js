const theVars = {
  get hello() {
    return "hello wolrd";
  },
};

console.log(theVars["hello"]);
console.log(theVars["this"] ?? "no this");
