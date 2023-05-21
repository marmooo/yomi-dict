import { readLines } from "https://deno.land/std/io/mod.ts";

const outPath = "yomi.csv";
const dicts = [
  "SudachiDict/src/main/text/small_lex.csv",
  "SudachiDict/src/main/text/core_lex.csv",
];

function kanaToHira(str) {
  return str.replace(/[ァ-ヶ]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function getWordFromSudachiDict(line) {
  const arr = line.split(",");
  const leftId = arr[1];
  const pos1 = arr[5];
  const pos2 = arr[6];
  const word = arr[0];
  const yomi = arr[11];
  if (leftId == "-1") return false;
  if (pos1 == "記号") return false;
  if (pos1 == "補助記号") return false;
  if (pos2 == "固有名詞") return false;
  if (!/[一-龠々]/.test(word)) return false;
  if (/\w/.test(word)) return false;
  return [word, yomi];
}

async function addDictData(path) {
  const fileReader = await Deno.open(path);
  for await (const line of readLines(fileReader)) {
    if (!line) continue;
    const data = getWordFromSudachiDict(line);
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

const db = {};
for (const dict of dicts) {
  await addDictData(dict);
}

// どの辞書を使っても都道府県は読めるように
const fileReader = await Deno.open("prefectures.lst");
for await (const line of readLines(fileReader)) {
  if (!line) continue;
  const [word, yomi] = line.split(",");
  if (db[word]) {
    db[word].push(yomi);
  } else {
    db[word] = [yomi];
  }
}

let result = "";
for (const [word, yomis] of Object.entries(db)) {
  result += word + "," + yomis.join(",") + "\n";
}
Deno.writeTextFileSync(outPath, result);
