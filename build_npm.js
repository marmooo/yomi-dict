import { build, emptyDir } from "jsr:@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.js"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "yomi-dict",
    version: "0.1.7",
    description: "Kanji reading dictionary.",
    license: "Apache-2.0",
    "main": "mod.js",
    repository: {
      type: "git",
      url: "git+https://github.com/marmooo/yomi-dict.git",
    },
    bugs: {
      url: "https://github.com/marmooo/yomi-dict/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.copyFileSync("yomi.csv", "npm/esm/yomi.csv");
    Deno.copyFileSync("yomi.csv", "npm/script/yomi.csv");
  },
});
