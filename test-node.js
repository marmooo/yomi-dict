const YomiDict = require(".");

async function main() {
  const dict = await YomiDict.load();
  console.log("学 --> " + dict.get("学"));
  console.log("学校 --> " + dict.get("学校"));
}
main();
