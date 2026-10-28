import type { ExhibitionProductId } from "#shared/exhibition";
import type { ProductId } from "#shared/products";

const exhibitionRequest = `GET ${EXHIBITION_URL.pathname}`;

export interface SocialCardSnippet {
  label: string;
  language: HighlightLanguage;
  code: string;
}

// Each result is the Plugin's output for its source, the JSON indented for reading.
export const SOCIAL_CARD_CODE: Record<
  Exclude<ProductId, ExhibitionProductId>,
  { source: SocialCardSnippet; result: SocialCardSnippet }
> = {
  headless: {
    source: {
      label: "site/templates/exhibition.php",
      language: "php",
      code: `<?php

echo \\Kirby\\Data\\Json::encode([
    'title' => $page->title()->value(),
    'description' => $page->description()->value(),
    'dates' => $page->dates()->value(),
    'url' => $page->url()
]);`,
    },
    result: {
      label: `${exhibitionRequest}\nAuthorization: Bearer <token>`,
      language: "json",
      code: JSON.stringify(
        {
          title: EXHIBITION_PAGE.title,
          description: EXHIBITION_PAGE.description,
          dates: EXHIBITION_PAGE.dates,
          url: EXHIBITION_SITE.url,
        },
        undefined,
        2,
      ),
    },
  },
  helpers: {
    source: {
      label: "site/snippets/head.php",
      language: "php",
      code: `<title><?= $page->title()->escape() ?></title>
<?= $page->meta()->social() ?>
<?= vite()->css('src/main.js') ?>
<?= vite()->js('src/main.js') ?>`,
    },
    result: {
      label: exhibitionRequest,
      language: "html",
      code: `<title>${EXHIBITION_PAGE.title}</title>
<meta content="${EXHIBITION_PAGE.description}" name="description">
<meta content="${EXHIBITION_SITE.title}" property="og:site_name">
<meta content="${EXHIBITION_SITE.url}" property="og:url">
<meta content="website" property="og:type">
<meta content="${EXHIBITION_PAGE.title}" property="og:title">
<meta content="${EXHIBITION_PAGE.description}" property="og:description">
<meta content="summary" name="twitter:card">
<meta content="${EXHIBITION_PAGE.title}" name="twitter:title">
<meta content="${EXHIBITION_PAGE.description}" name="twitter:description">
<link href="${EXHIBITION_URL.origin}/dist/assets/main-DiwrgTda.css" rel="stylesheet"><script src="${EXHIBITION_URL.origin}/dist/assets/main-BmA3xV9q.js" type="module"></script>`,
    },
  },
};
