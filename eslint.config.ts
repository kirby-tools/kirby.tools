import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: false,
  pnpm: false,
})
  .append({
    rules: {
      // Ignore rules clashing with Prettier
      "vue/html-closing-bracket-newline": "off",
      "vue/html-indent": "off",
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
    },
  })
  .append({
    files: ["content/1.docs/2.content-translator/2.configuration/1.global.md"],
    rules: {
      "markdown/no-missing-link-fragments": "off",
    },
  });
