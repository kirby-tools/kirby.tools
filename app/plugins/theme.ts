export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const { updateThemeColor } = useDynamicTheme();
    const route = useRoute();
    const router = useRouter();

    updateThemeColor(route);
    router.afterEach(updateThemeColor);
  },
});
