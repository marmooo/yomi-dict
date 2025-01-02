import { YomiDict } from "./mod.js";
import { assertEquals } from "@std/assert";

Deno.test("Simple check", async () => {
  const dict = await YomiDict.load("yomi.csv");
  assertEquals(dict.get("学校"), ["がっこう"]);
});
