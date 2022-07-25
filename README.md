# yomi-dict

Kanji reading dictionary.

## Build

1. install [SudachiDict](https://github.com/WorksApplications/SudachiDict)
   licensed under the [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
2. `deno run --allow-read --allow-write build.js`

## Usage (Deno)

```
// git clone https://github.com/marmooo/yomi-dict
import { YomiDict } from "yomi-dict/mod.js";

const dict = await YomiDict.load("yomi-dict/yomi.csv");
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
