# Plugin Panel Components Are Fetched, Not Published

A Mock of a Plugin on Vue 3 renders the Plugin's own component instead of a stand-in. The site sparse-clones the Plugin's `src/panel` and its committed `index.css` at the commit `plugins.json` pins, and compiles the Vue source itself, resolving every import from its own `package.json`. The fetch reads the pin from the Plugin's GitHub repository, so a pin moves only to a pushed commit.

## Considered Options

- **A `link:` dependency on the sibling checkout** – GitHub Actions cannot check out a repository outside the workspace, where the sibling sits.
- **An npm package per Plugin** – kirbyup emits one side-effect bundle for the Panel, not a library build, and every Plugin would gain a publish step.
- **A git submodule per Plugin** – pulls whole repositories for the same two paths.
