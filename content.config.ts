import { defineCollection, defineContentConfig, z } from "@nuxt/content";

// prettier-ignore
const variantEnum = z.enum(["solid", "outline", "subtle", "soft", "ghost", "link"]);
const badgeVariantEnum = z.enum(["solid", "outline", "subtle", "soft"]);
// prettier-ignore
const colorEnum = z.enum(["primary", "secondary", "neutral", "error", "warning", "success", "info"]);
const sizeEnum = z.enum(["xs", "sm", "md", "lg", "xl"]);
const orientationEnum = z.enum(["vertical", "horizontal"]);

const createBaseSchema = () =>
  z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
  });

const createFeatureItemSchema = () =>
  createBaseSchema().extend({
    orientation: orientationEnum.optional(),
    icon: z.string().nonempty(),
    class: z.string().optional(),
  });

const createLinkSchema = () =>
  z.object({
    label: z.string().nonempty(),
    icon: z.string().optional(),
    trailingIcon: z.string().optional(),
    to: z.string().nonempty(),
    size: sizeEnum.optional(),
    target: z.string().optional(),
    color: colorEnum.optional(),
    variant: variantEnum.optional(),
  });

const createBadgeSchema = () =>
  z.object({
    label: z.string().nonempty(),
    icon: z.union([
      z.string().nonempty(),
      z.object({
        name: z.string().nonempty(),
        class: z.string().optional(),
      }),
    ]),
    to: z.string().optional(),
    color: colorEnum.optional(),
    variant: badgeVariantEnum.optional(),
    size: sizeEnum.optional(),
    class: z.string().optional(),
  });

const createVideoSchema = () =>
  z.object({
    src: z.string().nonempty(),
    poster: z.string().nonempty(),
    label: z.string().optional(),
  });

const createCodeSchema = () =>
  z.object({
    files: z.array(
      z.object({
        filename: z.string().nonempty(),
        language: z.string().nonempty(),
        content: z.string().nonempty(),
      }),
    ),
    defaultFile: z.string().optional(),
  });

const createCardItemSchema = () =>
  z.object({
    id: z.string().nonempty(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    icon: z.string().nonempty(),
    color: z.string().optional(),
    gradient: z.string().optional(),
    to: z.string().optional(),
  });

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: "page",
      source: "index.yml",
      schema: createBaseSchema().extend({
        hero: createBaseSchema().extend({
          headline: createBadgeSchema(),
          links: z.array(createLinkSchema()),
        }),
        testimonials: createBaseSchema().extend({
          items: z.array(
            z.object({
              brand: z.string().nonempty(),
              logo: z.union([
                z.string().nonempty(),
                z.object({
                  light: z.string().nonempty(),
                  dark: z.string().nonempty(),
                }),
              ]),
              website: z.string().optional(),
              usage: z.string().optional(),
            }),
          ),
        }),
        products: z.array(
          createBaseSchema().extend({
            type: z.enum(["commercial", "free"]),
            id: z.string().nonempty(),
            to: z.string().nonempty(),
            headline: createBadgeSchema(),
            orientation: orientationEnum.optional(),
            reverse: z.boolean().optional(),
            video: createVideoSchema(),
            features: z.array(
              z.object({
                name: z.string().nonempty(),
                description: z.string().nonempty(),
                icon: z.string().nonempty(),
                to: z.string().optional(),
              }),
            ),
          }),
        ),
        cta: createBaseSchema().extend({
          links: z.array(createLinkSchema()),
          icon: z.object({
            name: z.string().nonempty(),
          }),
        }),
      }),
    }),
    pages: defineCollection({
      type: "page",
      source: {
        include: "**",
        exclude: ["index.yml", "**/changelog/**"],
      },
      schema: createBaseSchema(),
    }),
    docs: defineCollection({
      type: "page",
      source: "1.docs/**/*",
      schema: createBaseSchema(),
    }),
    product: defineCollection({
      source: "**/index.yml",
      type: "page",
      schema: createBaseSchema().extend({
        orientation: orientationEnum.optional(),
        hero: createBaseSchema().extend({
          headline: createBadgeSchema(),
          orientation: orientationEnum.optional(),
          links: z.array(createLinkSchema()),
          video: createVideoSchema(),
        }),
        sections: z.array(
          createBaseSchema().extend({
            id: z.string().nonempty(),
            slot: z.string().optional(),
            orientation: orientationEnum.optional(),
            reverse: z.boolean().optional(),
            headline: z.string().optional(),
            features: z
              .array(
                createFeatureItemSchema().extend({
                  image: z
                    .object({
                      src: z.string().nonempty(),
                      width: z.string().nonempty(),
                      height: z.string().nonempty(),
                      alt: z.string().optional(),
                      class: z.string().optional(),
                    })
                    .optional(),
                }),
              )
              .optional(),
            links: z.array(createLinkSchema()).optional(),
            video: createVideoSchema().optional(),
            code: createCodeSchema().optional(),
            cards: z.array(createCardItemSchema()).optional(),
          }),
        ),
        cta: createBaseSchema().extend({
          orientation: orientationEnum.optional(),
          links: z.array(createLinkSchema()),
        }),
      }),
    }),
    buy: defineCollection({
      source: "**/buy.yml",
      type: "page",
      schema: createBaseSchema().extend({
        hero: createBaseSchema(),
        plan: createBaseSchema().extend({
          price: z.string().nonempty(),
          discount: z.string().optional(),
          button: createLinkSchema(),
          features: z.array(z.string().nonempty()),
          highlight: z.boolean().optional(),
        }),
        faq: createBaseSchema().extend({
          items: z.array(
            z.object({
              label: z.string().nonempty(),
              content: z.string().nonempty(),
              defaultOpen: z.boolean().optional(),
            }),
          ),
        }),
      }),
    }),
    changelog: defineCollection({
      type: "page",
      source: "**/changelog.md",
      schema: createBaseSchema(),
    }),
    versions: defineCollection({
      type: "page",
      source: "**/changelog/*.md",
      schema: createBaseSchema().extend({
        date: z.string().nonempty(),
      }),
    }),
  },
});
