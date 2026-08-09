import { describe, expect, it } from "vitest";
import { alternatePath, pagePath, resolveAlternate } from "../shared/alternate";

describe("resolveAlternate", () => {
  it("resolves a documentation page to the docs collection", () => {
    expect(resolveAlternate("/docs/copilot/getting-started")).toEqual({
      kind: "collection",
      collection: "docs",
    });
  });

  it("resolves a blog post to the posts collection", () => {
    expect(resolveAlternate("/blog/copilot-v25")).toEqual({
      kind: "collection",
      collection: "posts",
    });
  });

  it("resolves a changelog to its product's releases", () => {
    expect(resolveAlternate("/copilot/changelog")).toEqual({
      kind: "changelog",
      productId: "copilot",
    });
  });

  it.each(["/", "/docs", "/blog", "/copilot/buy"])(
    "returns undefined for %s",
    (path) => {
      expect(resolveAlternate(path)).toBeUndefined();
    },
  );

  it("returns undefined for a product without a changelog", () => {
    expect(resolveAlternate("/minimap/changelog")).toBeUndefined();
  });

  it("returns undefined for an unknown product", () => {
    expect(resolveAlternate("/kirby-cli/changelog")).toBeUndefined();
  });

  it("returns undefined for a single release page", () => {
    expect(resolveAlternate("/copilot/changelog/25-0-0")).toBeUndefined();
  });
});

describe("alternatePath", () => {
  it("appends .md to a page path", () => {
    expect(alternatePath("/docs/copilot/getting-started")).toBe(
      "/docs/copilot/getting-started.md",
    );
  });

  it("drops a trailing slash", () => {
    expect(alternatePath("/docs/copilot/")).toBe("/docs/copilot.md");
  });
});

describe("pagePath", () => {
  it("strips .md from an alternate path", () => {
    expect(pagePath("/docs/copilot/getting-started.md")).toBe(
      "/docs/copilot/getting-started",
    );
  });

  it("returns undefined for a page path", () => {
    expect(pagePath("/docs/copilot/getting-started")).toBeUndefined();
  });
});
