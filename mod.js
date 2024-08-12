import { TextLineStream } from "jsr:@std/streams/text-line-stream";

export class YomiDict {
  static async fetch(url, options) {
    const response = await fetch(url, options);
    const text = await response.text();
    const dict = {};
    text.trimEnd().split("\n").forEach((line) => {
      const arr = line.split(",");
      const word = arr[0];
      const yomis = arr.slice(1);
      dict[word] = yomis;
    });
    const yomiDict = new YomiDict();
    yomiDict.dict = dict;
    return yomiDict;
  }

  static async load(filepath, options) {
    const dict = {};
    const file = await Deno.open(filepath, options);
    const lineStream = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    for await (const line of lineStream) {
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
