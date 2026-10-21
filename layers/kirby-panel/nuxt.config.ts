export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ["k-input-validator", "k-validator"].includes(tag),
    },
  },
});
