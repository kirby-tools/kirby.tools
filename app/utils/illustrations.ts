/** Loaders for the SVG markup of every illustration, keyed by file name without extension. */
export const ILLUSTRATION_LOADERS: Record<string, () => Promise<string>> =
  Object.fromEntries(
    Object.entries(
      import.meta.glob("../assets/illustrations/*.svg", {
        query: "?raw",
        import: "default",
      }),
    ).map(([filePath, loadSvgMarkup]) => [
      filePath.slice(filePath.lastIndexOf("/") + 1, -".svg".length),
      loadSvgMarkup,
    ]),
  );
