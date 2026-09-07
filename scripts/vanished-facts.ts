import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
import { promisify } from "node:util";

const docsDirectory = resolve(import.meta.dirname, "../content/1.docs");
const range = process.argv[2] ?? "HEAD";

// A number with an optional unit, or a backticked identifier.
const numberPattern =
  /(?<![\w`/.-])\d+(?:[.,]\d+)?(?: ?(?:ms|milliseconds|seconds|second|px|MB|KB|bytes|characters|chars|%|retries|texts|items))?(?![\w/-])/g;
const identifierPattern = /`([^`]+)`/g;

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isPresent = (fact: string, corpus: string) =>
  /^\d/.test(fact)
    ? new RegExp(`(?<![\\w/.-])${escape(fact)}(?![\\w/-])`).test(corpus)
    : corpus.includes(fact);

const { stdout: diff } = await promisify(execFile)(
  "git",
  ["diff", "-U0", range, "--", "."],
  { cwd: docsDirectory, encoding: "utf8" },
);

const removedFacts = new Map<string, Map<string, Set<string>>>();
let currentFile = "";

for (const line of diff.split("\n")) {
  if (line.startsWith("+++ b/")) {
    currentFile = line.slice("+++ b/content/1.docs/".length);
    continue;
  }
  if (!line.startsWith("-") || line.startsWith("---")) continue;

  const product = currentFile.split("/")[0]!;
  const facts = [
    ...(line.slice(1).match(numberPattern) ?? []),
    ...[...line.slice(1).matchAll(identifierPattern)].map((match) => match[1]!),
  ].filter((fact) => fact.length <= 40 && !["0", "1", "2"].includes(fact));

  for (const fact of facts) {
    const byProduct =
      removedFacts.get(product) ?? new Map<string, Set<string>>();
    const files = byProduct.get(fact) ?? new Set<string>();
    files.add(currentFile.split("/").at(-1)!);
    byProduct.set(fact, files);
    removedFacts.set(product, byProduct);
  }
}

for (const [product, facts] of removedFacts) {
  const entries = await readdir(join(docsDirectory, product), {
    recursive: true,
  });
  const corpus = (
    await Promise.all(
      entries
        .filter((entry) => entry.endsWith(".md"))
        .map((entry) => readFile(join(docsDirectory, product, entry), "utf8")),
    )
  ).join("\n");
  const vanished = [...facts].filter(([fact]) => !isPresent(fact, corpus));

  console.log(
    `== ${product.replace(/^\d+\./, "")}: ${vanished.length} facts no longer in the documentation`,
  );
  for (const [fact, files] of vanished.sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`   ${fact.padEnd(40)} (${[...files].sort().join(", ")})`);
  }
}
