import type { ProductId } from "#shared/constants";

// The one fictional site every landing-page Mock depicts: a photography
// exhibition, edited in a Panel that has all three plugins installed.

export const EXHIBITION_PAGE = {
  title: "Anna Vogel: Rooms of Silence",
  text: [
    "Anna Vogel photographs rooms after everyone has left them: a school gym on the first morning of the holidays, a ferry terminal at four in the morning, the back office of a shop that closed last spring.",
    "The twenty-eight prints in this exhibition were made over six winters in northern Germany and on the Faroe Islands. Vogel works with a large-format camera and available light, which means exposures long enough for the dust to settle inside the frame.",
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
        label: "Anna Vogel: Rooms of Silence",
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
      { label: "Anna Vogel", icon: "user", missingLanguages: ["es"] },
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
        label: "A Conversation With Anna Vogel",
        icon: "text",
        missingLanguages: ["es"],
      },
      { label: "Behind the Catalogue", icon: "text", missingLanguages: ["es"] },
      { label: "Opening Weekend", icon: "text", missingLanguages: ["es"] },
    ],
  },
  { label: "About", icon: "info", missingLanguages: ["es"] },
];
