import * as path from "https://deno.land/std/path/mod.ts";
import { readLines } from "https://deno.land/std/io/mod.ts";

class YomiDict {
  static async load() {
    const dict = {};
    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    const fileReader = await Deno.open(__dirname + "/yomi.csv");
    for await (const line of readLines(fileReader)) {
      const arr = line.split(",");
      const word = arr[0];
      const yomis = arr.slice(1);
      dict[word] = yomis;
    }
    const yomiDict = new YomiDict();
    yomiDict.dict = dict;
    return yomiDict;
  }

  constructor() {
    this.dict = {};
  }

  get(word) {
    return this.dict[word];
  }
}

export { YomiDict };
