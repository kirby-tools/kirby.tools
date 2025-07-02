import { withoutTrailingSlash } from "ufo";

export default defineNuxtRouteMiddleware((to) => {
  if (to.hash === "#pricing") {
    if (withoutTrailingSlash(to.path) === "/live-preview") {
      return navigateTo("/live-preview/buy/");
    }

    if (withoutTrailingSlash(to.path) === "/content-translator") {
      return navigateTo("/content-translator/buy/");
    }
  }
});
