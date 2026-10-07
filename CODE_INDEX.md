# CoreChatX website code index

Main-site repository `IceWolf23X/CoreChatX-website`, branch `main`; documentation targets plugin 2026.3.2. The runtime release source is the public `IceWolf23X/CoreChatX-website` repository. Pages publishes the root of `main`; the optional Actions artifact deployment is gated separately.
No package installation is required. Node.js 22 runs the generation tools and tests.

## Runtime entry points and content

- `index.html` — Landing, hash-routed wiki and GitHub Releases application shell; loads the data, generated snapshots and runtime scripts.
- `reference.html` — Independent configuration/command reference shell using the same content and renderers.
- `assets/js/boot.js`, `assets/js/app.js`, `assets/js/docs.js`, `assets/js/search.js`, `assets/js/utils.js` — Theme initialization, route/view lifecycle, documentation navigation, search and shared browser helpers.
- `assets/js/data/site-config.js` — Public product identity, colors, gallery settings and release source `IceWolf23X/CoreChatX-website`; contains no credentials.
- `assets/js/data/landing-content.js`, `assets/js/data/docs-content.js`, `assets/js/data/ui-text.js` — Landing sections, wiki catalog/metadata and interface text. `docs-content.js` points articles to their external HTML bodies; configuration articles reference the generated config bundle.
- `assets/content/docs/guides/` — Complete installation, advancement, FAQ, comparisons and two independent 15-step storage-migration/recovery guides, imported from production and verified for 2026.3.2.
- `assets/content/docs/reference/changelog.html` — 28 release-note entries through 2026.3.2; historical wording stays version-specific. Existing public GitHub download metadata remains separate.
- `assets/content/docs/**/*.html` — Readable source bodies for the 76 catalogued wiki articles, including stable in-page anchors; grouped here rather than indexed individually. Article directories may be nested by category/platform.
- `assets/js/legacy-routes.js` and root `features.html`, `installation.html`, `configuration.html`, `advancement-sync.html`, `docs.html`, `faq.html`, `changelog.html`, `migration*.html`, `tags.html` — Compatibility entrypoints mapping previous production pages/bookmarks to maintained local wiki articles.
- `assets/js/core/renderer.js`, `assets/js/core/config-renderer.js`, `assets/js/core/reference-renderer.js` — Content components, public configuration examples and reference rendering.
- `assets/js/core/syntax-highlight.js` — `COREX_HIGHLIGHT.render` applies explicit-language Highlight.js tokens after wiki/reference rendering; preserves raw code text and skips plain text, unknown languages and previously processed nodes.
- `assets/vendor/highlightjs/` — Unmodified Highlight.js 11.11.1 browser distribution, matching properties grammar and BSD-3-Clause license; loaded locally before the syntax renderer.
- `assets/css/syntax-highlight.css` — Highlight.js token colors using the existing light/dark code palette, without changing code-box dimensions.
- `assets/js/core/preview-gallery.js` — Gallery state, image validation, autoplay, navigation and reduced-motion handling.
- `assets/js/core/github-releases.js`, `assets/js/core/releases-core.js`, `assets/js/core/releases-renderer.js` — Public GitHub metadata, release normalization/cache and download UI; credentials are never passed to the browser.
- `assets/js/generated/config-files.js` — Generated offline bundle of the 19 source defaults and one generated template; rebuild from `synced-configs/`.
- `assets/js/generated/docs-bodies.js` — Generated offline bundle attaching `bodyHtml` to catalog metadata; rebuild from `assets/content/docs/` with `tools/build-docs-bundle.mjs`.
- `assets/js/generated/releases.js` — Generated offline fallback for public release metadata.
- `assets/css/` — Tokens, shared styling, landing, wiki, gallery, releases and ultrawide layouts.
- `assets/img/` — Bundled product logo and future public preview images.
- `synced-configs/paper/`, `synced-configs/velocity/` — Allow-listed public plugin defaults, excluding player/state data.
- `synced-configs/generated/velocity-advancements.properties` — Explicit template for a file produced by the Velocity runtime.
- `synced-configs/.sync-state.json` — Source repository, reference and commit provenance.

## Generation, validation and publication

- `tools/config-sync-map.mjs` — Contract mapping public defaults from `master` to source paths, article IDs and bundle targets; separately marks the generated template.
- `tools/sync-plugin-configs.mjs` — Copies only mapped defaults from a plugin checkout and records changed-source provenance.
- `tools/build-config-bundle.mjs` — Rebuilds the browser configuration snapshot from mapped files.
- `tools/build-docs-bundle.mjs` — Assembles article HTML sources into the committed docs bundle; `--check` validates freshness without writing.
- `tools/build-releases.mjs`, `tools/release-lib.mjs` — Refresh the public release fallback using the shared normalization contract.
- `tools/prepare-pages.mjs` — `preparePages` validates the public tree, checks docs-bundle freshness when a catalog is present, and packages only allow-listed runtime HTML, assets, configuration defaults and optional production domain/crawler/ownership files into ignored `_site/` with build provenance.
- `tools/publish-wip.mjs` — Portable first-publication helper for a fresh folder; validates the site, refuses unrelated existing repositories and verifies Pages deployment without requiring Windows launchers.
- `.github/workflows/deploy-pages.yml` — Node tests/validation, allow-listed artifact generation and Pages deployment, gated by `COREX_PAGES_ENABLED`.
- `.github/workflows/sync-plugin-configs.yml` — Optional private-source synchronization from `master`; disabled until a repository-scoped `COREX_PLUGIN_READ_TOKEN` secret is configured.
- `.github/workflows/build-releases.yml` — Public release snapshot refresh and optional bot commit; completion can trigger Pages deployment.
- `tests/*.test.cjs`, `tests/*.test.mjs` — Node regression tests for rendering utilities, gallery, release metadata, docs-bundle/catalog consistency, Pages packaging, source-branch consistency across guides/workflows and first-publication safeguards.
- `tests/legacy-pages.test.mjs` — Preserved production bookmark/article targets, real authored section coverage and Pages packaging of optional production metadata while excluding arbitrary root HTML.
- `tests/docs-bundle.test.mjs` — Docs catalog/body-file coverage, generated-bundle freshness and nested article-source validation.
- `tests/browser_docs_content.cjs` — Real offline `file://` Chromium checks for all 76 wiki articles, 20 configuration mounts, article/config search, responsive layout and the full reference; uses an already available Node Playwright runtime.
- `tests/syntax-highlight.test.cjs` — Real YAML/properties grammar checks, escaped HTML, explicit-language selection, repeated/dynamic rendering, missing-library fallback and offline entry-point load order.
- `tests/documentation.test.mjs` — Article/config coverage, category-based overview actions, absence of document-download provenance, maintained HTML-reference controls, retained scope anchors and valid internal wiki links.
- `tests/validate-theme.mjs` — Content structure, article/config references, local paths and generated bundle validation.
- `tests/browser_*.py` — Playwright acceptance harnesses for the wiki, gallery, releases, reference and responsive layouts; require Python Playwright, BeautifulSoup and Chromium.
- `.gitignore`, `.gitattributes`, `.nojekyll` — Private/local build exclusions, line-ending policy and static Pages behavior.

## Documentation and exclusions

- `README.md`, `SETUP.md` — Editing, docs-bundle/config-bundle validation, publication and reuse guides.
- `docs/ARCHITECTURE.md`, `docs/CUSTOMIZATION.md`, `docs/GALLERY.md`, `docs/GITHUB_RELEASES.md`, `docs/GITHUB_SYNC.md`, `docs/DEPLOY_WIP.md` — Runtime design and operating contracts.
- `docs/examples/plugin-repository-notify.yml` — Optional private-source notification example; publication does not install it in the plugin repository.
- `docs/*QA*`, `docs/*VERIF*`, `docs/qa-results.json` — Preparation-time evidence, not a substitute for a current deployment check.
- `CODE_INDEX.md` — This project map.

Excluded: `.git/`, ignored `.sync/` private-source verification files, generated `_site/` and `_site.tmp/`, Python caches and local publication state. The production website and historical preview are separate repositories.

## Main-site hosting identity

- `CNAME`, `robots.txt`, `sitemap.xml`, `googlee11c6bb42d6e0aeb.html` — Preserved production domain, existing public entry URLs and exact ownership-verification response. Optional Pages artifact inputs; never imported from the WIP identity.
