import type { ProductId } from "#shared/products";

export interface ExhibitionPageContent {
  title: string;
  description: string;
  dates: string;
  text: PanelBlock[];
}

export const EXHIBITION_PAGE: ExhibitionPageContent = {
  title: "Luise Frey: Rooms of Silence",
  description:
    "Twenty-eight large-format photographs of rooms just after the people have gone.",
  dates: "12 September – 30 November",
  text: [
    { type: "heading", level: "h2", text: "Rooms After Everyone Has Left" },
    {
      type: "text",
      text: "Luise Frey photographs rooms after everyone has left them: a school gym on the first morning of the holidays, a ferry terminal at four in the morning, the back office of a shop that closed last spring.",
    },
    {
      type: "text",
      text: "The twenty-eight prints in this exhibition were made over six winters in northern Germany and on the Faroe Islands. Frey works with a large-format camera and available light, which means exposures long enough for the dust to settle inside the frame.",
    },
    {
      type: "quote",
      text: "I wait until the dust has settled inside the frame.",
      citation: "Luise Frey",
    },
    {
      type: "text",
      text: "Rooms of Silence is her first solo exhibition in Leipzig. A conversation with the artist takes place on 14 November at 7 pm, admission free.",
    },
  ],
};

/** A shorter toolbar than Kirby's default, which overflows the sidebar column. */
export const EXHIBITION_DESCRIPTION_BUTTONS = [
  { icon: "title", title: "Headings" },
  { icon: "bold", title: "Bold" },
  { icon: "italic", title: "Italic" },
  { icon: "url", title: "Link" },
];

export const EXHIBITION_SITE = {
  title: "Kunsthalle Leipzig",
  url: "https://kunsthalle-leipzig.de/rooms-of-silence",
  faviconUrl: "/img/exhibition-favicon.svg",
};

// English is the default language, which Kirby lists first.
export const EXHIBITION_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
] as const;

export type ExhibitionLanguageCode =
  (typeof EXHIBITION_LANGUAGES)[number]["code"];

const [DEFAULT_LANGUAGE, ...SECONDARY_LANGUAGES] = EXHIBITION_LANGUAGES;
const [, SPANISH, FRENCH] = SECONDARY_LANGUAGES;

// Builds Kirby's own view buttons for the Exhibition page, the languages
// dropdown only for a current `languageCode`.
export function kirbyViewButtons(
  languageCode?: ExhibitionLanguageCode,
  switchLanguage?: (code: ExhibitionLanguageCode) => void,
): PanelViewButton[] {
  const toOption = ({ code, name }: (typeof EXHIBITION_LANGUAGES)[number]) => ({
    text: name,
    code,
    current: code === languageCode,
    click: switchLanguage && (() => switchLanguage(code)),
  });

  return [
    ...(languageCode
      ? [
          {
            component: "PanelLanguagesDropdown",
            props: {
              text: languageCode.toUpperCase(),
              options: [
                toOption(DEFAULT_LANGUAGE),
                "-",
                ...SECONDARY_LANGUAGES.map(toOption),
              ],
            },
          },
        ]
      : []),
    {
      text: "Unlisted",
      title: "Status: Unlisted",
      icon: "status-unlisted",
      theme: "info-icon",
      responsive: true,
    },
  ];
}

// Each plugin's view button as it renders by default, with its English label.
export const PLUGIN_VIEW_BUTTONS = {
  copilot: { label: "Copilot", icon: "sparkling", theme: "notice-icon" },
  "content-translator": {
    label: "Translator",
    icon: "content-translator-global",
    theme: "notice-icon",
  },
  "seo-audit": { label: "SEO Audit", theme: "positive-icon" },
} satisfies Partial<
  Record<ProductId, { label: string; icon?: string; theme: string }>
>;

export const COPILOT_PROMPT = `
Write the text and description for "{title}".

Artist: @page://artists/luise-frey
`.trim();

export const COPILOT_FIELDS: PanelFieldProps[] = [
  { name: "text", label: "Text" },
  { name: "description", label: "Description" },
  { name: "dates", label: "Dates" },
];

export const COPILOT_FIELDS_DROPDOWN = {
  under: "fields",
  value: ["text", "description"],
} as const satisfies PanelCopilotPromptDropdown;

export const COPILOT_SUGGESTION_PREFIX = "Luise Frey photographs rooms";

export const COPILOT_SUGGESTION_TYPED_TEXT = " after everyone has left them:";

export const COPILOT_SUGGESTION =
  "a school gym on the first morning of the holidays, a ferry terminal at four in the morning.";

export const TRANSLATOR_BATCH_TRANSLATION_TEXT = "EN → All Languages";

/**
 * Builds the plugin's dropdown items under its default config: the batch
 * translation in the default language, import and translation in every other.
 */
export function translatorDropdownOptions(
  languageCode: ExhibitionLanguageCode,
  actions?: {
    isDisabled: boolean;
    translateBatch: () => void;
    importContent: () => void;
    translateContent: () => void;
  },
): PanelDropdownOption[] {
  if (languageCode === "en") {
    return [
      {
        icon: "content-translator-global",
        text: TRANSLATOR_BATCH_TRANSLATION_TEXT,
        disabled: actions?.isDisabled,
        click: actions?.translateBatch,
      },
    ];
  }

  return [
    {
      icon: "import",
      text: "Import",
      disabled: actions?.isDisabled,
      click: actions?.importContent,
    },
    "-",
    {
      icon: "translate",
      text: `Translate → ${languageCode.toUpperCase()}`,
      disabled: actions?.isDisabled,
      click: actions?.translateContent,
    },
  ];
}

export const TRANSLATOR_DIALOG_FIELDS = {
  languages: {
    type: "checkboxes",
    label: "Translate to",
    options: EXHIBITION_LANGUAGES.slice(1).map(({ code, name }) => ({
      value: code,
      text: name,
    })),
    help: "Content from English will be translated and saved to all selected languages. This may take a few seconds.",
  },
  strategyName: {
    type: "toggles",
    label: "Translate with",
    labels: true,
    grow: true,
    options: [
      { value: "deepl", text: "DeepL", icon: "translate" },
      { value: "ai", text: "ChatGPT", icon: "content-translator-openai" },
    ],
  },
};

export const TRANSLATOR_DIALOG_VALUE = {
  languages: EXHIBITION_LANGUAGES.slice(1).map(({ code }) => code),
  strategyName: "ai",
};

export const TRANSLATOR_DIALOG_SUBMIT_BUTTON = {
  icon: "translate",
  text: "Translate",
};

export const SEO_RATINGS: PanelSeoAuditRatings = {
  seo: { rating: "bad" },
  readability: { rating: "good" },
};

export const SEO_RESULTS: PanelSeoAuditResults = {
  seo: [
    {
      rating: "good",
      text: '<a href="https://yoa.st/34h">SEO title width</a>: Good job.',
    },
    {
      rating: "ok",
      text: '<a href="https://yoa.st/34d">Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. <a href="https://yoa.st/34e">Use the space</a>.',
    },
    {
      rating: "bad",
      text: '<a href="https://yoa.st/34f">Outbound links</a>: No outbound links appear in this page. <a href="https://yoa.st/34g">Add some</a>!',
    },
  ],
  readability: [
    {
      rating: "good",
      text: '<a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.',
    },
  ],
};

export const SEO_REPORT_TIMESTAMP = Date.parse("2026-09-01T08:40Z");

const TRANSLATOR_COVERAGE = {
  de: { percentage: 100, incompletePageCount: 0 },
  es: { percentage: 21, incompletePageCount: 15 },
  fr: { percentage: 64, incompletePageCount: 5 },
};

// The Languages view of the exhibition site. English is the default language and gets no ring.
export const TRANSLATOR_COVERAGE_LANGUAGES: PanelContentTranslatorLanguageCoverage[] =
  SECONDARY_LANGUAGES.map(({ code, name }) => ({
    code,
    name,
    ...TRANSLATOR_COVERAGE[code],
  }));

export const TRANSLATOR_COVERAGE_TREE: PanelContentTranslatorTreeEntry[] = [
  {
    label: "Exhibitions",
    icon: "image",
    isOpen: true,
    missingLanguages: [],
    children: [
      {
        label: "Luise Frey: Rooms of Silence",
        icon: "image",
        missingLanguages: [SPANISH, FRENCH],
      },
      {
        label: "Winter Light",
        icon: "image",
        missingLanguages: [],
        children: [
          {
            label: "Opening Night",
            icon: "calendar",
            missingLanguages: [SPANISH],
          },
          {
            label: "Catalogue",
            icon: "book",
            missingLanguages: [SPANISH, FRENCH],
          },
        ],
      },
    ],
  },
  {
    label: "Artists",
    icon: "users",
    missingLanguages: [SPANISH],
    children: [
      { label: "Luise Frey", icon: "user", missingLanguages: [SPANISH] },
      {
        label: "Jonas Reuter",
        icon: "user",
        missingLanguages: [SPANISH, FRENCH],
      },
      { label: "Mette Sørensen", icon: "user", missingLanguages: [SPANISH] },
    ],
  },
  { label: "Visit", icon: "pin", missingLanguages: [SPANISH, FRENCH] },
  {
    label: "Blog",
    icon: "text",
    missingLanguages: [SPANISH],
    children: [
      {
        label: "Six Winters in the North",
        icon: "text",
        missingLanguages: [SPANISH],
      },
      {
        label: "Printing at Scale",
        icon: "text",
        missingLanguages: [SPANISH, FRENCH],
      },
      {
        label: "A Conversation With Luise Frey",
        icon: "text",
        missingLanguages: [SPANISH],
      },
      {
        label: "Behind the Catalogue",
        icon: "text",
        missingLanguages: [SPANISH],
      },
      { label: "Opening Weekend", icon: "text", missingLanguages: [SPANISH] },
    ],
  },
  { label: "About", icon: "info", missingLanguages: [SPANISH] },
];

// German carries a title of its own; Spanish and French keep the default
// language's.
export const EXHIBITION_CONTENT: Record<
  ExhibitionLanguageCode,
  Partial<ExhibitionPageContent>
> = {
  en: EXHIBITION_PAGE,
  de: {
    title: "Luise Frey: Räume der Stille",
    description:
      "Achtundzwanzig großformatige Fotografien von Räumen, kurz nachdem die Menschen gegangen sind.",
    dates: "12. September – 30. November",
    text: [
      {
        type: "heading",
        level: "h2",
        text: "Räume, nachdem alle gegangen sind",
      },
      {
        type: "text",
        text: "Luise Frey fotografiert Räume, nachdem alle sie verlassen haben: eine Schulturnhalle am ersten Ferienmorgen, ein Fährterminal um vier Uhr früh, das Hinterzimmer eines Ladens, der im vergangenen Frühjahr geschlossen hat.",
      },
      {
        type: "text",
        text: "Die achtundzwanzig Abzüge dieser Ausstellung sind in sechs Wintern in Norddeutschland und auf den Färöern entstanden. Frey arbeitet mit einer Großformatkamera und vorhandenem Licht, und so belichtet sie lange genug, dass sich der Staub im Bild legen kann.",
      },
      {
        type: "quote",
        text: "Ich warte, bis sich der Staub im Bild gelegt hat.",
        citation: "Luise Frey",
      },
      {
        type: "text",
        text: "Räume der Stille ist ihre erste Einzelausstellung in Leipzig. Am 14. November um 19 Uhr findet ein Gespräch mit der Künstlerin statt, der Eintritt ist frei.",
      },
    ],
  },
  es: {
    description:
      "Veintiocho fotografías de gran formato de espacios recién abandonados por la gente.",
    dates: "12 de septiembre – 30 de noviembre",
    text: [
      {
        type: "heading",
        level: "h2",
        text: "Espacios cuando todos se han ido",
      },
      {
        type: "text",
        text: "Luise Frey fotografía los espacios cuando todos se han ido: el gimnasio de un colegio la primera mañana de vacaciones, una terminal de ferris a las cuatro de la madrugada, la trastienda de una tienda que cerró la primavera pasada.",
      },
      {
        type: "text",
        text: "Las veintiocho copias de esta exposición se tomaron a lo largo de seis inviernos en el norte de Alemania y en las islas Feroe. Frey trabaja con una cámara de gran formato y luz natural, con exposiciones tan largas que el polvo llega a posarse dentro del encuadre.",
      },
      {
        type: "quote",
        text: "Espero a que el polvo se haya posado dentro del encuadre.",
        citation: "Luise Frey",
      },
      {
        type: "text",
        text: "Espacios de silencio es su primera exposición individual en Leipzig. El 14 de noviembre a las 19:00 tendrá lugar un encuentro con la artista, con entrada libre.",
      },
    ],
  },
  fr: {
    description:
      "Vingt-huit photographies grand format de lieux que l’on vient de quitter.",
    dates: "12 septembre – 30 novembre",
    text: [
      {
        type: "heading",
        level: "h2",
        text: "Des lieux une fois tout le monde parti",
      },
      {
        type: "text",
        text: "Luise Frey photographie les lieux une fois que tout le monde les a quittés : le gymnase d’une école au premier matin des vacances, un terminal de ferry à quatre heures du matin, l’arrière-boutique d’un magasin fermé au printemps dernier.",
      },
      {
        type: "text",
        text: "Les vingt-huit tirages de cette exposition ont été réalisés au fil de six hivers dans le nord de l’Allemagne et aux îles Féroé. Frey travaille à la chambre grand format et en lumière naturelle, avec des temps de pose assez longs pour que la poussière retombe dans le cadre.",
      },
      {
        type: "quote",
        text: "J’attends que la poussière soit retombée dans le cadre.",
        citation: "Luise Frey",
      },
      {
        type: "text",
        text: "Espaces du silence est sa première exposition personnelle à Leipzig. Une rencontre avec l’artiste aura lieu le 14 novembre à 19 h, entrée libre.",
      },
    ],
  },
};

const MINIMAP_BLOCK_ICONS: Record<PanelBlock["type"], string> = {
  heading: "title",
  text: "text",
  quote: "quote",
};

export const MINIMAP_FIELDS: PanelMinimapField[] = [
  {
    label: "Text",
    required: true,
    isActive: true,
    blocks: EXHIBITION_PAGE.text.map((block, index) => ({
      icon: MINIMAP_BLOCK_ICONS[block.type],
      text: block.text.slice(0, 50),
      // The blocks the Crop leaves in view.
      isActive: index < 3,
    })),
  },
  { label: "Description", required: true },
  { label: "Dates" },
];
