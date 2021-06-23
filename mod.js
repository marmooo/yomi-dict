import { readLines } from "https://deno.land/std/io/mod.ts";

class YomiDict {
  static async fetch(url) {
    const dict = await fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const d = {};
        text.split("\n").forEach((line) => {
          if (!line) return;
          const arr = line.split(",");
          const word = arr[0];
          const yomis = arr.slice(1);
          d[word] = yomis;
        });
        return d;
      }).catch((e) => {
        console.log(e);
      });
    const yomiDict = new YomiDict();
    yomiDict.dict = dict;
    return yomiDict;
  }

  static async load(filepath) {
    const dict = {};
    if (!filepath) {
      filepath = "./yomi-dict/yomi.csv";
    }
    const fileReader = await Deno.open(filepath);
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
