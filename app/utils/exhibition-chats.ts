// Hanna is an editor at the Exhibition's venue. Tool names, arguments, result
// fields and error texts follow the Plugin's agent tools; the values are the
// Exhibition's.

import type { WindowTab } from "~/components/Exhibition/Window.vue";
import type { ChatStep, ChatTool } from "~/composables/exhibition-chat";

/** A conversation and the title claude.ai gives it. */
export interface ChatScript {
  title: string;
  steps: ChatStep[];
}

export const CHAT_ACCOUNT = "hanna@kunsthalle-leipzig.de";

const SITE_HOST = "kunsthalle-leipzig.de";
const SITE_URL = `https://${SITE_HOST}`;
const PAGE_ID = "exhibitions/rooms-of-silence";
const PAGE_PANEL_PATH = "/panel/pages/exhibitions+rooms-of-silence";
const PAGE_PANEL_URL = `${SITE_URL}${PAGE_PANEL_PATH}`;
const LANGUAGE_QUERY = `?language=${EXHIBITION_DEFAULT_LANGUAGE.code}`;
const PAGE_COMPARE_URL = `${PAGE_PANEL_URL}/preview/compare${LANGUAGE_QUERY}`;
const COLLEAGUE_ACCOUNT = "jonas@kunsthalle-leipzig.de";

const ETAG_BEFORE = "9f2c41d0b7e3a58c61f04e2d9a7b3c15";
const ETAG_AFTER = "c07e8a91f2d64b35a1e9d07c4b8f26a3";

// Tabs carry the document titles the Panel and claude.ai set.
export const PANEL_TAB: WindowTab = {
  value: "panel",
  label: `${EXHIBITION_PAGE.title} | ${EXHIBITION_SITE.title}`,
  kind: "panel",
  host: `${SITE_HOST}${PAGE_PANEL_PATH}`,
};

export function claudeTab(chat: ChatScript): WindowTab {
  return {
    value: "claude",
    label: `${chat.title} - Claude`,
    kind: "claude",
    host: "claude.ai",
  };
}

const DESCRIPTION = EXHIBITION_PAGE.description;
const ARTIST_ID = "artists/luise-frey";

// The exhibition's text blocks, as the Plugin's tools take them and as Kirby
// stores them, with the ids it gives new blocks.
const TEXT_BLOCKS = EXHIBITION_PAGE.text.map(({ type, ...content }) => ({
  type,
  content: type === "text" ? { text: `<p>${content.text}</p>` } : content,
}));
const BLOCK_IDS = [
  "3f6c1e2a-8b4d-4c7e-9a15-2d0b6e8f4a31",
  "a92e4b70-1c5f-4e83-b6d2-7f0a9c3e5b18",
  "5d18f3c6-e27a-4b90-8c41-0e6b2a9d7f53",
  "c40b7a19-6e2d-4f58-a3c7-91d5e0b8f264",
  "e7a3d580-4f1b-4c26-9e8a-b25c0f7d3a96",
];
const STORED_TEXT_BLOCKS = TEXT_BLOCKS.map((block, index) => ({
  content: block.content,
  id: BLOCK_IDS[index],
  isHidden: false,
  type: block.type,
}));

// `text` was empty before, so `prepare_changes` cuts its excerpt from the start.
const STORED_TEXT_BLOCKS_EXCERPT = `${JSON.stringify(STORED_TEXT_BLOCKS).slice(0, 300)}…`;

const TOOL_FIND: ChatTool = {
  name: "find_pages",
  title: "Find pages",
  request: { query: "Luise Frey" },
  response: {
    pages: [
      {
        id: ARTIST_ID,
        title: "Luise Frey",
        template: "artist",
        status: "listed",
        hasChanges: false,
      },
      {
        id: PAGE_ID,
        title: EXHIBITION_PAGE.title,
        template: "exhibition",
        status: "unlisted",
        hasChanges: false,
      },
      {
        id: "blog/a-conversation-with-luise-frey",
        title: "A Conversation With Luise Frey",
        template: "post",
        status: "listed",
        hasChanges: false,
      },
    ],
    total: 3,
  },
  narration: "Looking for the exhibition and the artist page.",
};

const TOOL_GET_ARTIST: ChatTool = {
  name: "get_content",
  title: "Get content",
  request: { model: ARTIST_ID },
  response: {
    model: { type: "page", id: ARTIST_ID, template: "artist" },
    hasChanges: false,
    etag: "71b0e4c9d3a2f8165e07b9c4a1d6e3f2",
    fields: [
      {
        name: "biography",
        type: "writer",
        label: "Biography",
        value:
          "<p>Luise Frey photographs rooms after everyone has left them: a school gym on the first morning of the holidays, a ferry terminal at four in the morning, the back office of a shop that closed last spring.</p><p>Her series Rooms of Silence, twenty-eight prints, was made over six winters in northern Germany and on the Faroe Islands, with a large-format camera and available light. Her work has been shown in Hamburg and Tórshavn.</p>",
      },
      {
        name: "statement",
        type: "textarea",
        label: "Statement",
        value:
          "I wait until the dust has settled inside the frame. A room has to stop moving before I can photograph it.",
      },
      {
        name: "events",
        type: "structure",
        label: "Events",
        value: [
          {
            date: "2026-11-14 19:00:00",
            title: "Artist talk",
            venue: EXHIBITION_SITE.title,
            admission: "Free",
          },
        ],
      },
    ],
  },
  narration: "Reading the artist page.",
};

const TOOL_GET: ChatTool = {
  name: "get_content",
  title: "Get content",
  request: { model: PAGE_ID, fields: ["text", "description"] },
  response: {
    model: { type: "page", id: PAGE_ID, template: "exhibition" },
    hasChanges: false,
    etag: ETAG_BEFORE,
    fields: [
      { name: "text", type: "blocks", label: "Text", value: [] },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        maxlength: 160,
        value: "",
      },
    ],
  },
  narration: "Reading the exhibition page before writing.",
};

const TOOL_PREPARE: ChatTool = {
  name: "prepare_changes",
  title: "Prepare changes",
  request: {
    model: PAGE_ID,
    etag: ETAG_BEFORE,
    fields: { text: TEXT_BLOCKS, description: DESCRIPTION },
  },
  response: {
    changed: [
      {
        name: "text",
        before: "[]",
        after: STORED_TEXT_BLOCKS_EXCERPT,
        itemsBefore: 0,
        itemsAfter: TEXT_BLOCKS.length,
      },
      { name: "description", before: "", after: DESCRIPTION },
    ],
    ignored: [],
    warnings: [],
    hasChanges: true,
    etag: ETAG_AFTER,
    panelUrl: PAGE_COMPARE_URL,
  },
};

/**
 * Hanna asks for the text Copilot would write in the Panel, drawn from the
 * artist's page, and gets a link to review it there.
 */
export function prepareChat(onPrepared: () => void) {
  return {
    title: "Luise Frey exhibition text",
    steps: [
      {
        user: "Write the text and description for the Luise Frey exhibition from her artist page.",
      },
      { think: 1400 },
      { tool: TOOL_FIND, duration: 700 },
      { tool: TOOL_GET_ARTIST, duration: 900 },
      { tool: TOOL_GET, duration: 800 },
      { tool: TOOL_PREPARE, duration: 1300 },
      { run: onPrepared },
      {
        say: `The text and description are prepared as unsaved changes – nothing is live yet. The text draws on the artist page – her rooms, the six winters, her statement as a quote, and the artist talk on 14 November.\n\n[Review it in the Panel](${PAGE_PANEL_URL}${LANGUAGE_QUERY}) and publish it from there.`,
      },
    ],
  } satisfies ChatScript;
}

const OPENING_HOURS_COMPARE_URL = `${SITE_URL}/panel/pages/visit+opening-hours/preview/compare${LANGUAGE_QUERY}`;

/** Hanna asks what waits for review across the site. */
export const WAITING_CHAT: ChatScript = {
  title: "Pages waiting for review",
  steps: [
    { user: "What’s waiting for review on the site?" },
    { think: 900 },
    {
      tool: {
        name: "find_pages",
        title: "Find pages",
        request: { hasChanges: true, sortBy: "modified", direction: "desc" },
        response: {
          pages: [
            {
              id: PAGE_ID,
              title: EXHIBITION_PAGE.title,
              status: "unlisted",
              panelUrl: PAGE_COMPARE_URL,
              modified: "2026-10-17T16:42:08+02:00",
              hasChanges: true,
            },
            {
              id: "visit/opening-hours",
              title: "Opening Hours",
              status: "listed",
              panelUrl: OPENING_HOURS_COMPARE_URL,
              modified: "2026-10-14T09:15:31+02:00",
              hasChanges: true,
            },
          ],
          total: 2,
        },
      },
      duration: 900,
    },
    {
      say: `Two pages have unsaved changes:\n\n**${EXHIBITION_PAGE.title}** – [Open in the Panel](${PAGE_COMPARE_URL})\n\n**Opening Hours** – [Open in the Panel](${OPENING_HOURS_COMPARE_URL})\n\nNothing is live until you publish it in the Panel.`,
    },
  ],
};

const DATES_NOTE =
  "12 September – 30 November – TODO: extension until January?";

/** Hanna asks to publish; a note she left in the dates waits in the same changes. */
export const PUBLISH_GUARD_CHAT: ChatScript = {
  title: "Publishing the Luise Frey exhibition text",
  steps: [
    { user: "Publish the new text on the Luise Frey exhibition page." },
    { think: 1200 },
    {
      tool: {
        name: "get_content",
        title: "Get content",
        request: { model: PAGE_ID },
        response: {
          hasChanges: true,
          etag: "e85a2c07f4b913d6a0c5e8b72f1d49a3",
          panelUrl: PAGE_COMPARE_URL,
          changesBy: null,
          fields: [
            { name: "text", value: STORED_TEXT_BLOCKS },
            { name: "description", value: DESCRIPTION },
            { name: "dates", value: DATES_NOTE },
          ],
          changedFields: ["text", "description", "dates"],
        },
        narration: "Checking what else is in the unsaved changes.",
      },
      duration: 900,
    },
    {
      say: `I haven’t published yet. Publishing takes **all** unsaved changes of the page, and besides the text and description there’s one in \`dates\`:\n\n“${DATES_NOTE}”\n\nThat reads like a note that shouldn’t go live. Should I wait, or will you clear the dates in the Panel first? [Open the comparison](${PAGE_COMPARE_URL})`,
    },
  ],
};

const ETAG_COLLEAGUE = "b26f9d14e0c7a385f1e4d0b9a6c27e58";

/** Hanna asks for a change while a colleague edits the page in the Panel. */
export const LOCK_CHAT: ChatScript = {
  title: "Shortening the exhibition dates",
  steps: [
    {
      user: "Shorten the dates on the Luise Frey exhibition page to “12 Sep – 30 Nov”.",
    },
    { think: 800 },
    {
      tool: {
        name: "get_content",
        title: "Get content",
        request: { model: PAGE_ID, fields: ["dates"] },
        response: {
          hasChanges: true,
          etag: ETAG_COLLEAGUE,
          panelUrl: PAGE_COMPARE_URL,
          changesBy: COLLEAGUE_ACCOUNT,
          fields: [{ name: "dates", value: EXHIBITION_PAGE.dates }],
          changedFields: ["text"],
        },
      },
      duration: 700,
    },
    {
      tool: {
        name: "prepare_changes",
        title: "Prepare changes",
        request: {
          model: PAGE_ID,
          etag: ETAG_COLLEAGUE,
          fields: { dates: "12 Sep – 30 Nov" },
        },
        error: `${COLLEAGUE_ACCOUNT} is editing this content in the Panel. Try again once they leave its view, or 10 minutes after their last edit.`,
      },
      duration: 800,
    },
    {
      say: `${COLLEAGUE_ACCOUNT} is editing the page in the Panel, so Kirby keeps me from changing it. Ask me again once they’ve left the page, or 10 minutes after their last edit.`,
    },
  ],
};

// Two of the exhibition's prints, uploaded without alt text; `alt` is the text
// Claude writes for each.
const PRINTS = [
  {
    filename: "ferry-terminal.jpg",
    uuid: "file://p7Lq2xVm9KcT4wRa",
    mediaHash: "4e1b9c0a72-1792171814",
    etagBefore: "2a7f05c9e1d84b36f0c2a9e7d1b45f80",
    etagAfter: "d90e3b6a4c1f7825e0b9a3d6c2f17e44",
    alt: "An empty ferry terminal at night: rows of plastic seats under fluorescent light, the ticket counter closed",
  },
  {
    filename: "school-gym.jpg",
    uuid: "file://Wd3nF8sJ1bYh6QzE",
    mediaHash: "b05d8e2f19-1792171830",
    etagBefore: "6c19e4a0d7b3f5821e9a0c4d7b26f3e1",
    etagAfter: "f4a28d0c6e91b3570d2c8f1a9e64b7d3",
    alt: "A school gym in morning light, its floor freshly polished, the climbing ropes tied up against the wall bars",
  },
].map((print) => ({
  ...print,
  id: `${PAGE_ID}/${print.filename}`,
  url: `${SITE_URL}/media/pages/${PAGE_ID}/${print.mediaHash}/${print.filename}`,
  panelUrl: `${PAGE_PANEL_URL}/files/${print.filename}${LANGUAGE_QUERY}`,
}));

function fileSummary(print: (typeof PRINTS)[number]) {
  return {
    id: print.id,
    uuid: print.uuid,
    filename: print.filename,
    template: "image",
    alt: null,
    url: print.url,
    panelUrl: print.panelUrl,
  };
}

/** Hanna asks for the alt text her uploads lack, and Claude looks at each image first. */
export const ALT_TEXT_CHAT: ChatScript = {
  title: "Alt text for the exhibition images",
  steps: [
    {
      user: "Some images on the Luise Frey exhibition page have no alt text yet. Can you write it?",
    },
    { think: 1000 },
    {
      tool: {
        name: "find_files",
        title: "Find files",
        request: { parent: PAGE_ID, missing: "alt" },
        response: {
          files: PRINTS.map((print) => ({
            ...fileSummary(print),
            hasChanges: false,
          })),
          total: PRINTS.length,
        },
        narration: "Looking for the exhibition’s images without alt text.",
      },
      duration: 800,
    },
    ...PRINTS.map((print, index) => ({
      tool: {
        name: "view_image",
        title: "View image",
        request: { file: print.id },
        response: {
          ...fileSummary(print),
          width: 7200,
          height: 5760,
          etag: print.etagBefore,
        },
        ...(index === 0 && {
          narration: "Looking at each image before describing it.",
        }),
      },
      duration: 900,
    })),
    ...PRINTS.map((print) => ({
      tool: {
        name: "prepare_changes",
        title: "Prepare changes",
        request: {
          model: print.id,
          etag: print.etagBefore,
          fields: { alt: print.alt },
        },
        response: {
          changed: [{ name: "alt", before: "", after: print.alt }],
          ignored: [],
          warnings: [],
          hasChanges: true,
          etag: print.etagAfter,
          panelUrl: print.panelUrl,
        },
      },
      duration: 800,
    })),
    {
      say: `Both images have alt text now, as unsaved changes:\n\n${PRINTS.map((print) => `**${print.filename}** – “${print.alt}” – [Open in the Panel](${print.panelUrl})`).join("\n\n")}\n\nI wrote them in English. Should I translate them for the other languages too?`,
    },
  ],
};
