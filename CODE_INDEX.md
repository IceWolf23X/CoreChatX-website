# CoreChatX Website Code Index

## Public pages

- `index.html` — Product overview, 2026.3.0 release summary and changelog link, Paper and Velocity bStats data, and related CoreX plugins.
- `features.html` — Chat, channel-persistence preferences, private messages, moderation, integrations, YAML/MySQL storage, and network support.
- `installation.html` — Paper/Velocity and version-specific Java requirements, coordinated protocol-29 upgrade, YAML/MySQL migration and backup ownership, integrations, and validation checks.
- `configuration.html` — Paper and Velocity configuration and bundled examples, storage maintenance grammar, channel persistence, Discord admission and `{link_command}` message templates, commands on both platforms, runtime-data fields and ordering markers, safe configuration regeneration, strict YAML load failures, cold proxy mute enforcement, optional Modrinth stable/preview notices for OP players, permissions, and troubleshooting. Bundled examples match the 2026.3.0 release; existing section anchors are retained.
- `docs.html` — Documentation entry point, migration guide card, storage ownership, and release-notes links.
- `changelog.html` — Complete 46-entry 2026.3.0 release notes since 2026.2.6, with migration preparation advice alongside the upgrade steps. Fixes are grouped into storage/recovery, player state/moderation, Discord/integrations, and chat/menus; upgrade requirements and known limits remain visible.
- `migration.html` — Operator guide from 2026.2.6 YAML to 2026.3.0 MySQL: source backup, YAML-first upgrade, partial configuration examples, standalone/all-group proxy commands, verified cutover, current-state rollback, abort/retry and lease recovery, and preparation checks using an isolated copy of existing data before reopening player access. Linked from setup, documentation, configuration, FAQ, and changelog.
- `faq.html` — Common setup and behavior questions, including configurable staff bypass for private-message privacy and cold proxy moderation state.

## Shared assets

- `assets/corechatx-logo.svg` — Header, footer, favicon, and social preview logo.
- `assets/vendor/framebasecss/` — FrameBaseCSS distribution and license.
- `assets/vendor/highlightjs/` — Highlight.js distribution, properties module, and license.
- `assets/styles.css` — CoreChatX layouts, related-plugin cards, bStats presentation, and responsive adjustments.
- `assets/site.js` — Responsive navigation and syntax highlighting.

## Publication

- `CNAME` — GitHub Pages custom domain.
- `robots.txt` — Crawler rules and sitemap location.
- `sitemap.xml` — Public page URLs.
- `.gitignore` — Local file exclusions.
- `README.md` — Repository overview, page map, technology, and local preview instructions.
