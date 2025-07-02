import { withoutTrailingSlash } from "ufo";

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client && to.hash === "#pricing") {
    if (withoutTrailingSlash(to.path) === "/live-preview") {
      window.location.href = "/live-preview/buy/";
    }

    if (withoutTrailingSlash(to.path) === "/content-translator") {
      window.location.href = "/content-translator/buy/";
    }
  }
});
