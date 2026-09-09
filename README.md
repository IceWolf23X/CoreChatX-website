# CoreChatX Website

Static website for CoreChatX, available at:

<https://wiki-corechatx.icewolf23x.dev/>

## Pages

- `index.html`: product overview, latest release, live bStats data, and related CoreX plugins.
- `features.html`: chat, channels, player settings, moderation, integrations, and Velocity support.
- `installation.html`: Paper and Velocity installation and first setup.
- `configuration.html`: Paper and Velocity configuration reference.
- `migration.html`: 2026.2.6 YAML to 2026.3.0 MySQL guide for standalone Paper and all Velocity groups, with backups, cutover validation, storage rollback, and interruption recovery.
- `docs.html`: documentation hub.
- `faq.html`: common questions and troubleshooting.
- `changelog.html`: complete 2026.3.0 changes since 2026.2.6, with upgrade and storage-maintenance links.

## Technology

The site uses plain HTML, CSS, JavaScript, and SVG. FrameBaseCSS `1.2.0` provides the layout and components. Highlight.js `11.11.1` highlights YAML and Java properties examples. Required browser assets are stored under `assets/vendor/`.

## Local preview

Serve the repository root with a static HTTP server and open `index.html`.

The 2026.3.0 content uses the current plugin configuration and release changelog. Configuration samples match the bundled 2026.3.0 files. The reference covers platform-specific storage timeouts and commands, restart boundaries, current saved-data fields, safe configuration regeneration, channel persistence, and mandatory Discord admission. Runtime requirements distinguish Java 21 for Paper 1.21.11 from Java 25 for Paper 26.1/26.2. The migration guide starts with a complete plugin-folder backup, explains the difference between updating, importing, and activating MySQL, and provides separate Paper/Velocity steps with server state, file paths, password options, command results, and run/token examples. Optional rollback and recovery references follow the normal migration path. Keep bundled FrameBaseCSS and Highlight.js assets when previewing or publishing.

## GitHub Pages

GitHub Pages publishes the root of the `main` branch. `CNAME` configures the public custom domain.
