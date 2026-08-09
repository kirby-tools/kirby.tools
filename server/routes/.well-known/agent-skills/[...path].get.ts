import { PRODUCT_LIST, productSkillName } from "#shared/constants";

/**
 * Serves one skill file. `SKILL.md` gets its frontmatter, heading and version
 * line prepended here, so the stored body holds nothing that would drift.
 */
export default defineEventHandler(async (event) => {
  const [skillName, ...filePath] = (getRouterParam(event, "path") ?? "").split(
    "/",
  );

  const product = PRODUCT_LIST.find(
    (product) => productSkillName(product.id) === skillName,
  );
  if (!product || filePath.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Skill not found" });
  }

  const body = await useStorage("assets:server").getItem<string>(
    ["skills", skillName, ...filePath].join(":"),
  );
  if (typeof body !== "string") {
    throw createError({ statusCode: 404, statusMessage: "Skill not found" });
  }

  setResponseHeader(event, "Content-Type", "text/markdown; charset=utf-8");

  if (filePath.join("/") !== "SKILL.md") {
    return body;
  }

  const frontmatter = [
    "---",
    `name: ${productSkillName(product.id)}`,
    `description: ${JSON.stringify(product.skillDescription)}`,
    "---",
  ].join("\n");

  const provenance = await skillProvenance(event, product.id);

  return `${frontmatter}\n\n# ${product.name}\n\n${provenance}\n\n${body.trim()}\n`;
});
