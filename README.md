# CoreChatX Website

Static website for CoreChatX, available at:

<https://wiki-corechatx.icewolf23x.dev/>

## Pages

- `index.html`: product overview, latest release, live bStats data, and related CoreX plugins.
- `tags.html`: feature tags and 24 sourced plugin/module comparisons, a feature map, four YAML setup examples, complementary plugins, and switching guidance with explicit replacement boundaries.
- `features.html`: chat, channels, player settings, moderation, integrations, and Velocity support.
- `installation.html`: Paper and Velocity installation and first setup.
- `configuration.html`: Paper and Velocity configuration reference.
- `migration.html`: choose a complete migration procedure; preserves older guide links.
- `migration-paper.html`: standalone Paper walkthrough, steps 1–15 from full backup through reopening, with optional Paper rollback and recovery.
- `migration-velocity.html`: independent Velocity walkthrough, steps 1–15 including every network group, with optional proxy rollback and recovery.
- `docs.html`: documentation hub.
- `faq.html`: common questions and troubleshooting.
- `changelog.html`: 2026.3.0.1-hotfix notes and complete 2026.3.0 changes since 2026.2.6, with upgrade and storage-maintenance links.

## Technology

The site uses plain HTML, CSS, JavaScript, and SVG. FrameBaseCSS `1.2.0` provides the layout and components. Highlight.js `11.11.1` highlights YAML and Java properties examples. Required browser assets are stored under `assets/vendor/`.

## Local preview

Serve the repository root with a static HTTP server and open `index.html`.

The 2026.3.0.1-hotfix content uses the current plugin configuration and release changelog. Configuration samples match the bundled 2026.3.0.1-hotfix files. The reference covers platform-specific storage timeouts and commands, restart boundaries, current saved-data fields, safe configuration regeneration, channel persistence, and mandatory Discord admission. Runtime requirements distinguish Java 21 for Paper 1.21.11 from Java 25 for Paper 26.1/26.2. Each platform has a complete migration page that starts with a full plugin-folder backup and proceeds through 15 consecutive steps. Shared preparation is repeated on both pages, required commands and examples appear in place, and every step states the server state and completion condition. Optional rollback and recovery references follow the finished procedure. Keep bundled FrameBaseCSS and Highlight.js assets when previewing or publishing.

## GitHub Pages

GitHub Pages publishes the root of the `main` branch. `CNAME` configures the public custom domain.
