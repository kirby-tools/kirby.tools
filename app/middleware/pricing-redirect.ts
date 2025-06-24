import { withoutTrailingSlash } from "ufo";

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client && to.hash === "#pricing") {
    if (withoutTrailingSlash(to.path) === "/live-preview") {
      return navigateTo("/live-preview/buy", { redirectCode: 301 });
    }

    if (withoutTrailingSlash(to.path) === "/content-translator") {
      return navigateTo("/content-translator/buy", { redirectCode: 301 });
    }
  }
});
