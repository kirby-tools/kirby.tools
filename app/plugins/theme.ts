export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const { updateThemeColor } = useDynamicTheme();
    const route = useRoute();
    const router = useRouter();

    if (import.meta.server) updateThemeColor(route);
    router.afterEach(updateThemeColor);
  },
});
