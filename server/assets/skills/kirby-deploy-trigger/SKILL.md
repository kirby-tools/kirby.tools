## Install

```bash
composer require johannschopplich/kirby-deploy-trigger
```

Or extract the ZIP from the releases page into `site/plugins/`.

Then set the hook URL and add the button to the site blueprint:

```php [site/config/config.php]
return [
    'johannschopplich.deploy-trigger' => [
        'deployUrl' => 'https://api.netlify.com/build_hooks/<hook-id>'
    ]
];
```

```yaml [site/blueprints/site.yml]
buttons:
  - open
  - preview
  - deploy-trigger
  - languages
```

`buttons` is an allow-list, so Kirby's defaults have to be named alongside `deploy-trigger` or they disappear. A page blueprint takes the same entry. `panel.viewButtons.page` in `config.php` shows it in every page view whose blueprint sets no `buttons`.

<https://kirby.tools/docs/deploy-trigger.md>

## Sending a Token or a Body

`requestOptions` takes the options of Kirby's `Remote` class: a token goes in `headers`, a body in `data`. An array in `data` is sent as form fields, so a JSON hook takes `json_encode()` and a `Content-Type: application/json` header. The server sends the request, so the URL and the token never reach the browser.

<https://kirby.tools/docs/deploy-trigger/configuration.md>

## Vercel, Netlify, and GitHub Actions

Vercel and Netlify hand out a URL that needs no token. GitHub Actions takes `https://api.github.com/repos/<owner>/<repo>/dispatches` with an `agent`, a bearer token with write access to **Contents**, and `json_encode(['event_type' => 'deploy'])` matching the workflow's `repository_dispatch` types. The workflow file has to be on the default branch; on any other, GitHub answers 204 and runs nothing.

<https://kirby.tools/docs/deploy-trigger/platforms.md>

## Keeping a Role From Deploying

`deploy: false` under `johannschopplich.deploy-trigger` in a role blueprint hides the button and makes the server refuse the request. A role blueprint with `"*": false` turns `deploy` off too; `deploy: true` next to the wildcard grants it back.

<https://kirby.tools/docs/deploy-trigger/permissions.md>

## When a Deployment Fails

The Panel error names the hook's status code and its response body, or the connection error for an unknown host or a timeout. `Missing "johannschopplich.deploy-trigger.deployUrl" plugin option` means the config the Panel runs with has no `deployUrl`.

<https://kirby.tools/docs/deploy-trigger.md>
