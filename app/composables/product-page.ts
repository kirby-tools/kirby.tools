import { withoutTrailingSlash } from "ufo";
import { socialCardPath } from "#shared/social-card";

/** Loads the current Product's landing page and sets its head. */
export async function useProductPage() {
  const route = useRoute();
  const { productId } = useProduct();
  const id = productId.value!;
  const path = withoutTrailingSlash(route.path);

  const asyncData = useAsyncData(path, () =>
    queryCollection("product").path(path).first(),
  );
  const { data: page } = asyncData;
  const title = () => page.value?.seo?.title || page.value?.title;
  const description = () =>
    page.value?.seo?.description || page.value?.description;

  // Registered before the `await`: past it, Vue has lost the component and
  // would keep the tags after the reader navigates away.
  useSeoMeta({
    titleTemplate: "",
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogImage: socialCardPath(id),
  });

  await asyncData;

  if (!page.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  }

  return page;
}
