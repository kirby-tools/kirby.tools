// Kirby's repository carries no root `package.json` and its `panel` package is
// private, so its Panel source cannot be a pnpm dependency.

import { access, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { x } from "tinyexec";

interface Source {
  repository: string;
  ref: string;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const kirby: Source & { version: string } = await readJson("kirby.json");
const plugins: Record<string, Source> = await readJson("plugins.json");

await checkout({
  name: "kirby",
  label: `Kirby ${kirby.version}`,
  target: resolve(root, "kirby"),
  source: kirby,
  paths: [
    "panel/src",
    "panel/public",
    "panel/package.json",
    "i18n/translations/en.json",
  ],
});

for (const [id, source] of Object.entries(plugins)) {
  await checkout({
    name: id,
    target: resolve(root, "plugins", id),
    source,
    paths: ["src/panel", "/index.css"],
  });
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(resolve(root, file), "utf8"));
}

async function checkout({
  name,
  label,
  target,
  source: { repository, ref },
  paths,
}: {
  name: string;
  label?: string;
  target: string;
  source: Source;
  paths: string[];
}) {
  const git = async (...args: string[]) => {
    const { stdout } = await x("git", ["-C", target, ...args], {
      throwOnError: true,
    });

    return stdout.trim();
  };

  const revision = label ? `${label} (${ref.slice(0, 9)})` : ref.slice(0, 9);

  await mkdir(target, { recursive: true });

  if (!(await exists(resolve(target, ".git")))) {
    await git("init", "-q");
    await git("remote", "add", "origin", repository);
  } else {
    await git("remote", "set-url", "origin", repository);
  }

  // Set on every run, so a changed `paths` reaches a checkout already at `ref`.
  await git("sparse-checkout", "set", "--no-cone", ...paths);

  const currentRef = await git("rev-parse", "HEAD").catch(() => undefined);
  if (currentRef === ref) {
    console.log(`${name}: already at ${revision}`);
    return;
  }

  await git("fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", ref);
  await git("checkout", "-q", "--detach", ref);

  console.log(`${name}: checked out ${revision}`);
}

async function exists(path: string) {
  return access(path).then(
    () => true,
    () => false,
  );
}
