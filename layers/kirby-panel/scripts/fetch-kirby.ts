// Kirby's repository carries no root `package.json` and its `panel` package is
// private, so the Panel source cannot be a pnpm dependency. This script clones
// it at the commit `kirby.json` pins instead.
//
// The clone stays out of the repository: Kirby's license permits copies for
// developing and deploying a website, not redistribution of its source.

import { access, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { x } from "tinyexec";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, "kirby");

const { repository, ref, version } = JSON.parse(
  await readFile(resolve(root, "kirby.json"), "utf8"),
);

const PATHS = [
  "panel/src",
  "panel/public",
  "panel/package.json",
  "i18n/translations/en.json",
];

if (await isCurrent()) {
  console.log(`kirby: already at ${version} (${ref.slice(0, 9)})`);
  process.exit(0);
}

await mkdir(target, { recursive: true });

if (!(await exists(resolve(target, ".git")))) {
  await git("init", "-q");
  await git("remote", "add", "origin", repository);
}

await git("sparse-checkout", "set", "--no-cone", ...PATHS);
await git("fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", ref);
await git("checkout", "-q", "--detach", ref);

console.log(`kirby: checked out Kirby ${version} (${ref.slice(0, 9)})`);

async function isCurrent() {
  try {
    return (await git("rev-parse", "HEAD")) === ref;
  } catch {
    return false;
  }
}

async function exists(path: string) {
  return access(path).then(
    () => true,
    () => false,
  );
}

async function git(...args: string[]) {
  const { stdout } = await x("git", ["-C", target, ...args], {
    throwOnError: true,
  });

  return stdout.trim();
}
