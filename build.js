import { readLines } from "https://deno.land/std/io/mod.ts";

const outPath = "yomi.csv";
const dicts = {
  // JmDict: ['JmdictFurigana.txt'],
  // IPADic: [  // require iconv
  //   'ipadic-2.7.0/Adverb.utf8.dic',
  //   'ipadic-2.7.0/Adnominal.utf8.dic',
  //   'ipadic-2.7.0/Noun.adjv.utf8.dic',
  //   'ipadic-2.7.0/Noun.adverbal.utf8.dic',
  //   'ipadic-2.7.0/Noun.verbal.utf8.dic',
  //   'ipadic-2.7.0/Verb.utf8.dic',
  // ],
  NaistJdic: [ // require iconv
    "mecab-naist-jdic-0.6.3b-20111013/naist-jdic.utf8.csv",
  ],
  // UniDic: ['unidic-csj-3.0.1.1/lex.csv'],
  SudachiDict: [
    "SudachiDict/src/main/text/small_lex.csv",
    "SudachiDict/src/main/text/core_lex.csv",
  ],
};

function kanaToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function getWordFromJmDict(line) {
  const [word, yomi] = line.split("|", 2);
  return [word, yomi];
}

function getWordFromIPADic(line) {
  const p11 = line.indexOf("見出し語 (") + 6;
  const p12 = line.slice(p11).indexOf(")");
  const [word, _cost] = line.slice(p11, p11 + p12).split(" ");
  const p21 = line.indexOf("(読み ") + 4;
  const p22 = line.slice(p21).indexOf(")");
  const yomi = line.slice(p21, p21 + p22).split(" ")[0];
  return [word, yomi];
}

function getWordFromNaistJdic(line) {
  const arr = line.split(",");
  const pos2 = arr[5];
  if (pos2 == "固有名詞") {
    return false;
  }
  const word = arr[0];
  const yomi = arr[11];
  return [word, yomi];
}

function getWordFromUniDic(line) {
  line = line.replace(/"[^"]+"/, "");
  const arr = line.split(",");
  const pos2 = arr[5];
  if (pos2 == "固有名詞") {
    return false;
  }
  const surface = arr[0];
  const lemma = arr[11];
  if (surface != lemma) {
    // yomi は語彙素基準
    // 動詞や形容詞の活用形の扱いが難しい
    return false;
  }
  let yomi = arr[24];
  if (yomi == "*") {
    yomi = arr[10];
  }
  return [surface, yomi];
}

function getWordFromSudachiDict(line) {
  const arr = line.split(",");
  const leftId = arr[1];
  const pos1 = arr[5];
  const pos2 = arr[6];
  if (leftId == "-1") return false;
  if (pos1 == "記号") return false;
  if (pos1 == "補助記号") return false;
  if (pos2 == "固有名詞") return false;
  const word = arr[0];
  const yomi = arr[11];
  return [word, yomi];
}

async function addDictData(dictName, path) {
  const fileReader = await Deno.open(path);
  for await (const line of readLines(fileReader)) {
    if (!line) continue;
    let data;
    switch (dictName) {
      case "IPADic":
        data = getWordFromIPADic(line);
        break;
      case "JmDict":
        data = getWordFromJmDict(line);
        break;
      case "NaistJdic":
        data = getWordFromNaistJdic(line);
        break;
      case "UniDic":
        data = getWordFromUniDic(line);
        break;
      case "SudachiDict":
        data = getWordFromSudachiDict(line);
        break;
      default:
        console.log("dictName error.");
    }
    if (data) {
      let [word, yomi] = data;
      if (/[一-龠々]/.test(word)) { // 漢字を含む語彙に限定
        const yomis = d[word];
        yomi = kanaToHira(yomi);
        if (yomis) {
          if (!yomis.includes(yomi)) {
            d[word].push(yomi);
          }
        } else {
          d[word] = [yomi];
        }
      }
    }
  }
}

const d = {};
for (const [dictName, paths] of Object.entries(dicts)) {
  for (const path of paths) {
    await addDictData(dictName, path);
  }
}

// どの辞書を使っても都道府県は読めるように
const fileReader = await Deno.open("prefectures.lst");
for await (const line of readLines(fileReader)) {
  if (!line) continue;
  const [word, yomi] = line.split(",");
  if (d[word]) {
    d[word].push(yomi);
  } else {
    d[word] = [yomi];
  }
}

let result = "";
for (const [word, yomis] of Object.entries(d)) {
  result += word + "," + yomis.join(",") + "\n";
}
Deno.writeTextFileSync(outPath, result);
