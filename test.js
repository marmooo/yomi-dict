import { YomiDict } from "./mod.js";

let dict = await YomiDict.load("yomi.csv");
console.log("学 --> " + dict.get("学"));
console.log("学校 --> " + dict.get("学校"));

dict = await YomiDict.fetch(
  "https://raw.githubusercontent.com/marmooo/yomi-dict/main/yomi.csv",
);
console.log("学 --> " + dict.get("学"));
console.log("学校 --> " + dict.get("学校"));
