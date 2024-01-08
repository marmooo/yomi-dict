import { TextLineStream } from "https://deno.land/std/streams/mod.ts";

const kanji = "\u3400-\u9FFF\uF900-\uFAFF\u{20000}-\u{37FFF}";
const kanjiRegexp = new RegExp(`[${kanji}々]`, "u");
const idiomRegexp = new RegExp(`^[ぁ-ゖァ-ヶー${kanji}々]+$`, "u");
const outPath = "yomi.csv";
const dicts = [
  "SudachiDict/src/main/text/small_lex.csv",
  "SudachiDict/src/main/text/core_lex.csv",
];

function kanaToHira(str) {
  return str.replace(/[ァ-ヶ]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function getWordYomi(line) {
  const arr = line.split(",");
  const surface = arr[0];
  const leftId = arr[1];
  const pos1 = arr[5];
  const pos2 = arr[6];
  const yomi = arr[11];
  if (leftId == "-1") return;
  if (pos1 == "記号") return;
  if (pos1 == "補助記号") return;
  if (pos2 == "固有名詞") return;
  if (!kanjiRegexp.test(surface)) return;
  if (!idiomRegexp.test(surface)) return;
  if (pos1 != "名詞" && surface.includes("ー")) return; // noisy
  return [surface, yomi];
}

const db = {};
for (const dict of dicts) {
  const file = await Deno.open(dict);
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const data = getWordYomi(line);
    if (data) {
      let [word, yomi] = data;
      const yomis = db[word];
      yomi = kanaToHira(yomi);
      if (yomis) {
        if (!yomis.includes(yomi)) {
          db[word].push(yomi);
        }
      } else {
        db[word] = [yomi];
      }
    }
  }
}

// どの辞書を使っても都道府県は読めるように
const file = await Deno.open("prefectures.lst");
const lineStream = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());
for await (const line of lineStream) {
  const [word, yomi] = line.split(",");
  if (db[word]) {
    if (!db[word].includes(yomi)) {
      db[word].push(yomi);
    }
  } else {
    db[word] = [yomi];
  }
}

let result = "";
for (const [word, yomis] of Object.entries(db)) {
  result += word + "," + yomis.join(",") + "\n";
}
Deno.writeTextFileSync(outPath, result);
