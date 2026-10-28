export default defineNuxtConfig({
  // The Mocks' types, auto-imported into the app only: `shared/types` would
  // reach the server too, which reads none of them.
  imports: {
    dirs: ["types"],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ["k-input-validator", "k-validator"].includes(tag),
    },
  },
});
