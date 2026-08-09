# ProductId is the canonical key, routes are derived

Product data used to be spread across one array keyed by landing-page path (`PRODUCT_ITEMS`, found via `item.to === "/" + slug`) and three records keyed by slug (`GITHUB_REPOS`, `COMPOSER_PACKAGES`, `PRODUCT_COLOR_SLOT`), so the same entity had two competing keys and its identity was a URL. We consolidated everything into a single `PRODUCTS` registry keyed by `ProductId`, from which `ProductId` is derived as a union type and from which every path is computed.

The alternative – keeping the route as the identity – reads naturally in a website codebase, but it couples the domain to the URL design: renaming a landing page would silently break the color, repository and Composer lookups, none of which are about routing. Deriving routes from the key makes that impossible, and an unknown ProductId now fails to compile rather than producing an empty `LIKE '%undefined/%'` query at runtime.
