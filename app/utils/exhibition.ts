import type { ProductId } from "#shared/products";

// The one fictional site every landing-page Mock depicts: a photography
// exhibition, edited in a Panel that has all three plugins installed.

// The Products whose Plugins the exhibition's Panel has installed.
export const EXHIBITION_PRODUCT_IDS = [
  "copilot",
  "content-translator",
  "seo-audit",
] as const satisfies readonly ProductId[];

export type ExhibitionProductId = (typeof EXHIBITION_PRODUCT_IDS)[number];

export const EXHIBITION_PAGE = {
  title: "Luise Frey: Rooms of Silence",
  text: [
    "Luise Frey photographs rooms after everyone has left them: a school gym on the first morning of the holidays, a ferry terminal at four in the morning, the back office of a shop that closed last spring.",
    "The twenty-eight prints in this exhibition were made over six winters in northern Germany and on the Faroe Islands. Frey works with a large-format camera and available light, which means exposures long enough for the dust to settle inside the frame.",
    "Rooms of Silence is her first solo exhibition in Kassel. A conversation with the artist takes place on 14 November at 7 pm, admission free.",
  ].join("\n\n"),
  description:
    "Twenty-eight large-format photographs of rooms just after the people have gone. Kassel, 12 September to 30 November.",
  dates: "12 September – 30 November",
};

// The buttons Kirby puts on every page view, which a plugin's button joins.
export const KIRBY_VIEW_BUTTONS: PanelViewButton[] = [
  { icon: "window" },
  { icon: "cog", dropdown: true },
  { text: "Unlisted", icon: "status-unlisted", theme: "info-icon" },
];

// Each plugin's view button, as its blueprint documentation defines it.
export const PLUGIN_VIEW_BUTTONS = {
  copilot: {
    text: "Copilot",
    icon: "sparkling",
    theme: "notice-icon",
    responsive: true,
  },
  "content-translator": {
    text: "Translator",
    icon: "content-translator-global",
    theme: "notice-icon",
    responsive: true,
  },
  "seo-audit": {
    text: "SEO Audit",
    icon: "seo-audit-analyze",
    theme: "positive",
    responsive: true,
  },
} satisfies Partial<Record<ProductId, PanelViewButtonProps>>;

export const COPILOT_PROMPT = `Write the teaser for "{title}" in our house voice, max 60 words.

Use the attached press photo and the artist's page: @page://artists/luise-frey`;

export const COPILOT_PROMPT_PREVIEW = COPILOT_PROMPT.replace(
  "{title}",
  EXHIBITION_PAGE.title,
);

export const TRANSLATOR_DIALOG_FIELDS = {
  languages: {
    type: "checkboxes",
    label: "Translate to",
    options: [
      { value: "de", text: "Deutsch" },
      { value: "es", text: "Español" },
      { value: "fr", text: "Français" },
    ],
    help: "Content from English will be translated and saved to all selected languages. This may take a few seconds.",
  },
  provider: {
    type: "toggles",
    label: "Translate with",
    labels: true,
    grow: true,
    options: [
      { value: "deepl", text: "DeepL", icon: "translate" },
      { value: "ai", text: "GPT (OpenAI)", icon: "content-translator-openai" },
    ],
  },
};

export const TRANSLATOR_DIALOG_VALUE = {
  languages: ["de", "es", "fr"],
  provider: "ai",
};

export const TRANSLATOR_DIALOG_BUTTONS = [
  { icon: "cancel", text: "Cancel" },
  { icon: "translate", text: "Translate", theme: "positive" },
];

export const SEO_REPORT: PanelSeoAuditResultEntry[] = [
  {
    rating: "good",
    text: '<a href="https://yoa.st/34h">SEO title width</a>: Good job.',
  },
  {
    rating: "good",
    text: '<a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.',
  },
  {
    rating: "ok",
    text: '<a href="https://yoa.st/34d">Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. <a href="https://yoa.st/34e">Use the space</a>.',
  },
  {
    rating: "bad",
    text: '<a href="https://yoa.st/34f">Outbound links</a>: No outbound links appear in this page. <a href="https://yoa.st/34g">Add some</a>!',
  },
];

// The Languages view of the exhibition site. English is the default language and gets no ring.
export const TRANSLATOR_COVERAGE_LANGUAGES: PanelContentTranslatorLanguageCoverage[] =
  [
    { code: "de", name: "Deutsch", percentage: 100, incompletePageCount: 0 },
    { code: "fr", name: "Français", percentage: 64, incompletePageCount: 5 },
    { code: "es", name: "Español", percentage: 21, incompletePageCount: 15 },
  ];

export const TRANSLATOR_COVERAGE_TREE: PanelContentTranslatorTreeEntry[] = [
  {
    label: "Exhibitions",
    icon: "image",
    isOpen: true,
    children: [
      {
        label: "Luise Frey: Rooms of Silence",
        icon: "image",
        missingLanguages: ["es", "fr"],
      },
      {
        label: "Winter Light",
        icon: "image",
        children: [
          {
            label: "Opening Night",
            icon: "calendar",
            missingLanguages: ["es"],
          },
          { label: "Catalogue", icon: "book", missingLanguages: ["es", "fr"] },
        ],
      },
    ],
  },
  {
    label: "Artists",
    icon: "users",
    missingLanguages: ["es"],
    children: [
      { label: "Luise Frey", icon: "user", missingLanguages: ["es"] },
      { label: "Jonas Reuter", icon: "user", missingLanguages: ["es", "fr"] },
      { label: "Mette Sørensen", icon: "user", missingLanguages: ["es"] },
    ],
  },
  { label: "Visit", icon: "pin", missingLanguages: ["es", "fr"] },
  {
    label: "Blog",
    icon: "text",
    missingLanguages: ["es"],
    children: [
      {
        label: "Six Winters in the North",
        icon: "text",
        missingLanguages: ["es"],
      },
      {
        label: "Printing at Scale",
        icon: "text",
        missingLanguages: ["es", "fr"],
      },
      {
        label: "A Conversation With Luise Frey",
        icon: "text",
        missingLanguages: ["es"],
      },
      { label: "Behind the Catalogue", icon: "text", missingLanguages: ["es"] },
      { label: "Opening Weekend", icon: "text", missingLanguages: ["es"] },
    ],
  },
  { label: "About", icon: "info", missingLanguages: ["es"] },
];
