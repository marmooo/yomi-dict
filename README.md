# yomi-dict

Kanji reading dictionary.

## Build

1. install [SudachiDict](https://github.com/WorksApplications/SudachiDict)
2. install
   [NAIST-jdic](https://ja.osdn.net/projects/naist-jdic/downloads/53500/mecab-naist-jdic-0.6.3b-20111013.tar.gz/)
3. `deno run --allow-read --allow-write build.js`

## Usage (Deno)

```
import { YomiDict } from "yomi-dict/mod.js";

const dict = await YomiDict.load();
dict.get('学校');  // --> [がっこう]
```

## Usage (Node.js)

```
// npm install yomi-dict
const YomiDict = require("yomi-dict");

async function main() {
  const dict = await YomiDict.load();
  dict.get('学校');  // --> [がっこう]
}
main();
```

## License

Apache-2.0

## Attribution

- [SudachiDict](https://github.com/WorksApplications/SudachiDict) is licensed
  under the [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0).
