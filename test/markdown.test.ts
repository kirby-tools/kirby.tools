import type { PageCollectionItemBase } from "@nuxt/content";
import type { MinimarkNode } from "minimark";
import { describe, expect, it } from "vitest";
import { stringifyPageBody } from "../server/utils/markdown";

describe("stringifyPageBody", () => {
  it("renders a latest-version component as a download link", () => {
    const page = pageOf([
      ["p", {}, "Download the ", ["latest-version", {}], " or head over."],
    ]);

    expect(
      stringifyPageBody(page, {
        url: "https://github.com/johannschopplich/kirby-helpers/releases/latest",
        label: "latest release",
      }),
    ).toContain(
      "Download the [latest release](https://github.com/johannschopplich/kirby-helpers/releases/latest) or head over.",
    );
  });

  it("writes an external link without its rel", () => {
    const page = pageOf([
      [
        "p",
        {},
        "See the ",
        ["a", { href: "https://getkirby.com", rel: ["nofollow"] }, "docs"],
        ".",
      ],
    ]);

    expect(stringifyPageBody(page)).toBe(
      "See the [docs](https://getkirby.com).\n",
    );
  });

  it("writes a className array as a class attribute", () => {
    const page = pageOf([
      ["p", {}, "Label ", ["u-badge", { className: ["ml-2", "rounded-full"] }]],
    ]);

    expect(stringifyPageBody(page)).toBe(
      'Label <u-badge class="ml-2 rounded-full"></u-badge>\n',
    );
  });

  it("starts the code block after a list item's text on a line of its own", () => {
    const page = pageOf([
      [
        "ul",
        {},
        ["li", {}, "Run:", ["pre", { language: "bash", code: "pnpm install" }]],
      ],
    ]);

    expect(stringifyPageBody(page)).toBe(
      "- Run:\n\n```bash\npnpm install\n```\n",
    );
  });

  it("collapses the blank lines between a component's blocks but keeps those in its code", () => {
    const page = pageOf([
      [
        "card",
        {},
        ["p", {}, "One"],
        ["p", {}, "Two"],
        ["pre", { language: "php", code: "$a;\n\n\n$b;" }],
      ],
    ]);

    expect(stringifyPageBody(page)).toBe(
      "<card>\n\nOne\n\nTwo\n\n```php\n$a;\n\n\n$b;\n```\n\n</card>\n",
    );
  });

  it("keeps the indent of a code block in a nested list item", () => {
    const page = pageOf([
      [
        "ul",
        {},
        [
          "li",
          {},
          "Outer",
          [
            "ul",
            {},
            ["li", {}, "Run:", ["pre", { language: "sh", code: "a\n\n\nb" }]],
          ],
        ],
      ],
    ]);

    expect(stringifyPageBody(page)).toBe(
      "- Outer\n  - Run:\n\n  ```sh\n  a\n\n\n  b\n  ```\n",
    );
  });
});

function pageOf(value: MinimarkNode[]) {
  return { body: { type: "minimark", value } } as PageCollectionItemBase;
}
