import { joinURL } from "ufo";

const DOMAIN_REDIRECTS = {
  "kirbycopilot.com": {
    basePath: "/copilot",
    pathMappings: {
      "/": "/copilot",
      "/playground": "/copilot/playground",
      "/changelog": "/copilot/changelog",
      "/buy": "/copilot/buy",
    },
  },
  "kirbyseo.com": {
    basePath: "/seo-audit",
    pathMappings: {
      "/": "/seo-audit",
      "/playground": "/seo-audit/playground",
      "/changelog": "/seo-audit/changelog",
      "/buy": "/seo-audit/buy",
    },
  },
} as const;

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.server) return;

  const { hostname } = useRequestURL();
  const { path: pathname, hash } = to;

  // Handle new pricing page redirects
  if (hostname === "kirby.tools" && hash === "#pricing") {
    if (pathname === "/live-preview") {
      return navigateTo("/live-preview/buy", { redirectCode: 301 });
    }

    if (pathname === "/content-translator") {
      return navigateTo("/content-translator/buy", { redirectCode: 301 });
    }
  }

  // Check if hostname needs redirect
  const redirectConfig =
    DOMAIN_REDIRECTS[hostname as keyof typeof DOMAIN_REDIRECTS];
  if (!redirectConfig) return;

  // Check for specific path mapping first
  const specificMapping =
    redirectConfig.pathMappings[
      pathname as keyof typeof redirectConfig.pathMappings
    ];

  let redirectPath: string;
  if (specificMapping) {
    redirectPath = specificMapping;
  } else if (pathname.startsWith("/docs/")) {
    // Extract the docs path after `/docs/`
    const docsPath = pathname.substring(5);
    redirectPath = joinURL("/docs", redirectConfig.basePath, docsPath);
  } else {
    redirectPath = joinURL(redirectConfig.basePath, pathname);
  }

  return navigateTo(joinURL("https://kirby.tools", redirectPath), {
    redirectCode: 301,
    external: true,
  });
});
