import { PRODUCT_LIST, productSkillName } from "#shared/constants";

/**
 * Skill discovery index in the v0.1.0 shape the `skills` CLI accepts: no
 * `$schema`, and every entry's `files` must include `SKILL.md`.
 */
export default defineEventHandler(async () => {
  const skills = await Promise.all(
    PRODUCT_LIST.map(async (product) => {
      const keys = await skillFileKeys(product.id);
      const files = keys
        .map((key) => skillFilePath(product.id, key))
        .sort(
          (a, b) =>
            Number(b === "SKILL.md") - Number(a === "SKILL.md") ||
            a.localeCompare(b),
        );

      return {
        name: productSkillName(product.id),
        description: SKILL_DESCRIPTIONS[product.id],
        files,
      };
    }),
  );

  return { skills };
});
