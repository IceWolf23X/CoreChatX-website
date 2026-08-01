# CoreChatX Website

Official static website for CoreChatX, published with GitHub Pages at:

`https://wiki-corechatx.icewolf23x.dev/`

## Technology

The site uses plain HTML, CSS, JavaScript, and SVG. GitHub Pages serves the
repository files directly from the root of `main`; the website has no package
manager or production build step.

FrameBaseCSS `1.2.0` supplies the public component and layout contracts.
Highlight.js `11.11.1`, together with the FrameBaseCSS highlighting addon,
handles YAML and Java properties syntax. Both released distributions are kept
locally under `assets/vendor/`, so normal page rendering does not depend on an
external CDN.

## Local preview

Open `index.html` directly for a quick content check. For accurate navigation
and browser behavior, serve the repository root with any existing static HTTP
server and open its local URL. No project-specific server is required.

## Structure

- `index.html`: overview, operating modes, latest update, and public bStats.
- `features.html`: user-focused overview of chat, channels, player settings,
  moderation, integrations, and Velocity support.
- `installation.html`: complete standalone Paper and Velocity setup, including
  first startup, optional integrations, clean configuration regeneration,
  backups, reload rules, and final checks.
- `docs.html`: documentation hub.
- `configuration.html`: complete Paper and Velocity configuration guide,
  including every current default block, user-focused explanation, saved-data
  warning, command, permission, limit, and troubleshooting procedure.
- `faq.html`: practical FAQ for server owners.
- `assets/vendor/framebasecss/`: pinned FrameBaseCSS `1.2.0` base,
  Highlight.js addon, and MIT license.
- `assets/vendor/highlightjs/`: pinned Highlight.js `11.11.1` browser build,
  Java properties language module, and BSD 3-Clause license.
- `assets/styles.css`: the few CoreChatX-specific layout compositions not
  supplied by FrameBaseCSS; it does not override the framework color tokens.
- `assets/site.js`: mobile navigation and Highlight.js initialization.
- `assets/corechatx-logo.svg`: original CoreChatX brand logo and favicon.
- `robots.txt` and `sitemap.xml`: crawler metadata for the project-site URL.

## Content sources

Technical claims must remain aligned with:

- `../plugin/docs/PLUGIN_CONFIGURATION_INSTRUCTIONS.md`
- `../plugin/docs/PLUGIN_FEATURES_LISTED.md`
- `../release/CoreChatX-2026.2.6/CHANGELOG_2026.2.6.md`

Do not present roadmap items, example URLs, or undocumented behavior as current
product facts.

## Updating the release

The visible release number and homepage “Latest update” summary are currently
`2026.2.6`. When publishing a new release:

1. verify the release changelog and plugin documentation;
2. update the homepage release summary;
3. update visible version labels and page metadata;
4. verify that the Modrinth project page contains the matching public release.

## Links and statistics

Official external destinations are written directly in the HTML. The public
usage section embeds numeric CoreX-Badges endpoints and links to the matching
bStats pages.

## Theme

The site uses the unmodified FrameBaseCSS `1.2.0` default dark theme by loading
`assets/vendor/framebasecss/framebase.min.css` directly. CoreChatX does not
override the FrameBaseCSS color tokens and does not provide a light-theme
selector or store a theme preference.

`assets/styles.css` contains only CoreChatX-specific layout and composition
rules. The original CoreChatX logo and externally rendered bStats charts remain
independent visual assets. Literal color names, HEX values, gradients, and
MiniMessage formatting in technical documentation remain exact configuration
text.

## Syntax highlighting

YAML blocks use `language-yaml`; Java properties blocks use
`language-properties`. Highlight.js performs language parsing in the browser,
and `framebase-highlight.min.css` supplies the visual token styles. The website
does not maintain a separate custom YAML parser or syntax-color implementation.

## GitHub Pages

All internal assets and links use relative paths, so the site works both at the
custom-domain root and under the `/CoreChatX-website/` project path. Canonical,
Open Graph, sitemap, and crawler URLs use the production custom domain.

Before publishing, verify every page locally and stage only the intended site
files. Local legacy backup ZIP files must never be committed or published.
