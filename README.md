# yomi-dict

Kanji reading dictionary.

## Build

1. install [SudachiDict](https://github.com/WorksApplications/SudachiDict)
   licensed under the [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
2. `deno run --allow-read --allow-write build.js`

## Usage

```
import { YomiDict } from "yomi-dict/mod.js";

const dict = await YomiDict.load("yomi.csv");
dict.get('学校');  // --> [がっこう]
```

## License

Apache-2.0
