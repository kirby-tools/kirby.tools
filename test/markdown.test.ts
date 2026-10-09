import type { PageCollectionItemBase } from "@nuxt/content";
import { describe, expect, it } from "vitest";
import { stringifyPageBody } from "../server/utils/markdown";

describe("stringifyPageBody", () => {
  it("renders a latest-version component as a download link", () => {
    const page = {
      body: {
        type: "minimark",
        value: [
          ["p", {}, "Download the ", ["latest-version", {}], " or head over."],
        ],
      },
    } as unknown as PageCollectionItemBase;

    expect(
      stringifyPageBody(page, {
        url: "https://github.com/johannschopplich/kirby-helpers/releases/latest",
        label: "latest release",
      }),
    ).toContain(
      "Download the [latest release](https://github.com/johannschopplich/kirby-helpers/releases/latest) or head over.",
    );
  });
});
