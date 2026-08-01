# CoreChatX Website Code Index

Compact technical map of the static CoreChatX website.

## Public pages

- `index.html` — Main entry point. Explains the product, operating modes,
  CoreChatX 2026.2.6 update, public usage badges, related CoreX plugins, and
  setup routes.
- `features.html` — User-focused product overview covering chat, channels,
  private messages, player settings, moderation, interactive features,
  Discord, Telegram, Velocity networks, and server management.
- `installation.html` — Complete installation guide for Java 21 and Paper
  1.21.11, jar placement, first startup, standalone and proxy modes, optional
  integrations, clean configuration regeneration, backups, reload rules, and
  final checks.
- `docs.html` — Documentation entry point linking the product, setup,
  configuration, and FAQ paths.
- `configuration.html` — Complete Paper and Velocity guide based on the
  current plugin configuration instructions: every configuration file and
  default value, plain-language explanation, saved-data warning, command,
  permission, safety limit, validation step, and troubleshooting procedure.
- `faq.html` — Native disclosure-based practical FAQ for server owners.

## Shared implementation

- `assets/vendor/framebasecss/framebase.min.css` — Unmodified FrameBaseCSS
  `1.2.0` default dark theme, component, and layout distribution loaded by every
  page.
- `assets/vendor/framebasecss/framebase-highlight.min.css` — FrameBaseCSS
  presentation addon for Highlight.js output.
- `assets/vendor/framebasecss/LICENSE` — MIT license retained with the local
  FrameBaseCSS distribution.
- `assets/vendor/highlightjs/highlight.min.js` — Pinned Highlight.js `11.11.1`
  browser build. It recognizes YAML and the common bundled languages.
- `assets/vendor/highlightjs/languages/properties.min.js` — Additional Java
  properties language registration loaded after the Highlight.js browser build.
- `assets/vendor/highlightjs/LICENSE` — BSD 3-Clause license retained with the
  local Highlight.js distribution.
- `assets/styles.css` — Narrow project-specific compositions for the logo,
  documentation index, release layout, related-plugin cards, bStats assets,
  and responsive adjustments. It does not override FrameBaseCSS color tokens.
- `assets/site.js` — Initializes Highlight.js and controls the non-modal
  FrameBaseCSS responsive navigation.
- `assets/corechatx-logo.svg` — Original CoreChatX brand mark used as the header
  logo, footer logo, favicon, and social preview reference.

## Publication and documentation

- `CNAME` — GitHub Pages custom-domain contract for
  `wiki-corechatx.icewolf23x.dev`.
- `robots.txt` — Allows crawling and points to the project sitemap.
- `sitemap.xml` — Lists all six public GitHub Pages URLs.
- `.gitignore` — Keeps timestamped local website backup archives outside Git
  and GitHub Pages publication.
- `README.md` — Repository purpose, local preview, content sources, release
  maintenance, FrameBaseCSS integration, and GitHub Pages behavior.
- `CODEX_HANDOFF.md` — Existing untracked local handoff; not part of the
  published website or this implementation.

## External data

The homepage embeds numeric CoreX-Badges images and usage charts for Paper/Purpur
and Velocity, links to bStats, and loads the official logos for four related
CoreX plugins from their GitHub Pages sites. GitHub and Modrinth are the primary
public project destinations.

## Exclusions

- `.git/`, local backup ZIP files, caches, temporary files, and generated output
  are not site content.
- The removed `extra/` directory contained stale copies of plugin documentation.
- The removed support-policy page is intentionally outside the 2026.2.6 site
  until its business and policy claims are reviewed separately.
- No Node project, package-manager manifest, or production build output is
  maintained. Third-party browser distributions and their licenses are pinned
  under `assets/vendor/` for direct GitHub Pages delivery.
