import { YomiDict } from "./mod.js";
import { assertEquals } from "https://deno.land/std/assert/mod.ts";

Deno.test("Simple check", async () => {
  const dict = await YomiDict.load("yomi.csv");
  assertEquals(dict.get("学校"), ["がっこう"]);
});
