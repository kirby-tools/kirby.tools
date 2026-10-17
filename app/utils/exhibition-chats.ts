// The conversations a Chat plays: Hanna, an editor at the Exhibition's venue,
// asks Claude to work on the exhibition page. Tool names, arguments, result
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
// The site is multilingual, so the Panel URL a write or `get_content` returns
// names the language; a `find_pages` row's doesn't.
const LANGUAGE_QUERY = `?language=${EXHIBITION_DEFAULT_LANGUAGE.code}`;
const COMPARE_URL = `${PAGE_PANEL_URL}/preview/compare${LANGUAGE_QUERY}`;
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

// `prepare_changes` and `find_pages` report a value longer than 300 characters
// cut short; `get_content` returns it whole.
function shortValue(value: unknown) {
  const text = JSON.stringify(value);
  return text.length > 300 ? `${text.slice(0, 300)}…` : value;
}

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
        before: [],
        after: shortValue(STORED_TEXT_BLOCKS),
        itemsBefore: 0,
        itemsAfter: TEXT_BLOCKS.length,
      },
      { name: "description", before: "", after: DESCRIPTION },
    ],
    ignored: [],
    warnings: [],
    hasChanges: true,
    etag: ETAG_AFTER,
    panelUrl: COMPARE_URL,
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

const OPENING_HOURS_PANEL_URL = `${SITE_URL}/panel/pages/visit+opening-hours`;

/** Hanna asks what waits for review across the site. */
export function waitingChat() {
  return {
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
                panelUrl: PAGE_PANEL_URL,
                hasChanges: true,
              },
              {
                id: "visit/opening-hours",
                title: "Opening Hours",
                status: "listed",
                panelUrl: OPENING_HOURS_PANEL_URL,
                hasChanges: true,
              },
            ],
            total: 2,
          },
        },
        duration: 900,
      },
      {
        say: `Two pages have unsaved changes:\n\n**${EXHIBITION_PAGE.title}** – [Open in the Panel](${PAGE_PANEL_URL})\n\n**Opening Hours** – [Open in the Panel](${OPENING_HOURS_PANEL_URL})\n\nNothing is live until you publish it in the Panel.`,
      },
    ],
  } satisfies ChatScript;
}

const DATES_NOTE =
  "12 September – 30 November – TODO: extension until January?";

/** Hanna asks to publish; a note she left in the dates waits in the same changes. */
export function publishGuardChat() {
  return {
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
            panelUrl: COMPARE_URL,
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
        say: `I haven’t published yet. Publishing takes **all** unsaved changes of the page, and besides the text and description there’s one in \`dates\`:\n\n“${DATES_NOTE}”\n\nThat reads like a note that shouldn’t go live. Should I wait, or will you clear the dates in the Panel first? [Open the comparison](${COMPARE_URL})`,
      },
    ],
  } satisfies ChatScript;
}

const ETAG_PUBLISHED = "5d93a0e7c1b84f26e0a7d3c9b1f4e862";

/** Hanna asks for a ticket widget's script tag, which the site refuses from agents. */
export function scriptChat() {
  const value = `${DESCRIPTION} <script src="https://tickets.kunsthalle-leipzig.de/widget.js"></script>`;
  return {
    title: "Ticket widget in the description",
    steps: [
      {
        user: "Add our ticket widget to the end of the Luise Frey exhibition’s description: ",
        paste:
          '<script src="https://tickets.kunsthalle-leipzig.de/widget.js"></script>',
      },
      { think: 900 },
      {
        tool: {
          name: "get_content",
          title: "Get content",
          request: { model: PAGE_ID, fields: ["description"] },
          response: {
            hasChanges: false,
            etag: ETAG_PUBLISHED,
            fields: [{ name: "description", value: DESCRIPTION }],
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
            etag: ETAG_PUBLISHED,
            fields: { description: value },
          },
          error:
            "`description` contains the element `<script>`, which the site doesn't accept from agents. Write it without. What the field already holds passes when you send it unchanged.",
        },
        duration: 800,
      },
      {
        say: "The site doesn’t accept a `<script>` element from an agent, so nothing changed. A widget like this belongs in the page’s template – your developer can add it there, once for every exhibition page.",
      },
    ],
  } satisfies ChatScript;
}

/** Hanna asks for a change while a colleague edits the page in the Panel. */
export function lockChat() {
  // A colleague's edit makes the unsaved changes, and their etag, the content
  // an agent reads.
  const etag = "b26f9d14e0c7a385f1e4d0b9a6c27e58";
  return {
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
            etag,
            panelUrl: COMPARE_URL,
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
            etag,
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
  } satisfies ChatScript;
}
