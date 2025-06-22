export default defineNuxtRouteMiddleware((to) => {
  if (to.hash === "#pricing") {
    if (to.path === "/live-preview") {
      return navigateTo("/live-preview/buy", { redirectCode: 301 });
    }

    if (to.path === "/content-translator") {
      return navigateTo("/content-translator/buy", { redirectCode: 301 });
    }
  }
});
