import { joinURL } from "ufo";

export function useAssetUrl(path: MaybeRefOrGetter<string>) {
  const { assetsBaseUrl } = useRuntimeConfig().public;

  return computed(() => joinURL(assetsBaseUrl, toValue(path)));
}
