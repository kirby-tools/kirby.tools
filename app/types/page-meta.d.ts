declare module "#app" {
  interface PageMeta {
    /** Whether the page owns the whole viewport, without the site's header and footer. */
    standalone?: boolean;
  }
}

export {};
