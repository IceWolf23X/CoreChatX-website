# CoreChatX Website

**Primary website: [CoreChatX](https://wiki-corechatx.icewolf23x.dev/).** This repository contains the CoreChatX 2026.3.2 landing page, wiki, configuration reference and public release catalog. Keep the repository history, CNAME and ownership-verification response when updating the site.

GitHub Pages currently publishes the root of `main` using its branch-based build. The included Actions deployment workflow is optional and gated by `COREX_PAGES_ENABLED`; switching to it also requires choosing GitHub Actions as the Pages source. Do not run the WIP first-publication helper to recreate this existing repository.

The 19 published plugin defaults come from `IceWolf23X/CoreChatX-plugin`, branch `master`, commit `9d1ef37bd266f18e7451d61db7e8ebaf91a055c2`. Future private-source synchronization requires the separate `COREX_PLUGIN_READ_TOKEN` secret; its workflow stays disabled until that credential is configured.

The documentation targets **CoreChatX 2026.3.2**. The complete installation, advancement and storage-migration guides are bundled in the wiki, alongside the release changelog. Previous public `.html` URLs redirect to their corresponding wiki articles and sections.

The download catalog reads the actual public GitHub Releases from `IceWolf23X/CoreChatX-website`, including their published metadata and assets. The release catalog is independent of the private plugin source and uses public metadata without browser credentials.

## CoreChatX website theme

Static, reusable CoreX product website with a landing page and documentation wiki.

**Start here: [SETUP.md](SETUP.md)** — practical Italian walkthrough from ZIP to local editing, preview gallery, GitHub secrets, configuration synchronization, hosting and reuse for CoreArmorX.

Gallery maintenance reference: [docs/GALLERY.md](docs/GALLERY.md).

The shipped site has **no backend**. Open `index.html` directly. Landing copy, wiki metadata, navigation labels, product identity, links, theme colors and asset paths are read from JavaScript data files. Documentation article bodies are published as readable HTML sources and loaded through the generated offline docs bundle.

## Edit the website

| File | Purpose |
| --- | --- |
| `assets/js/data/site-config.js` | Product name, logo/favicon paths, external links, hero gallery images/settings, public GitHub release repository and light/dark theme colors. |
| `assets/js/data/landing-content.js` | Landing navigation and every landing section, including order, cards, FAQ and footer. |
| `assets/js/data/docs-content.js` | Wiki groups, hubs, article metadata, order and `bodyFile` references. |
| `assets/content/docs/<article-id>.html` | One readable HTML source for each article body, with stable anchors. |
| `assets/js/generated/docs-bodies.js` | Generated offline bundle that attaches `bodyHtml` to the catalog. Do not edit it manually. |
| `assets/js/data/ui-text.js` | Interface text: search, theme, documentation controls, copy/expand labels and errors. |
| `assets/js/legacy-routes.js` | Previous production page and bookmark routes; root compatibility HTML files load this map and open the corresponding wiki article. |
| `assets/img/` | Image assets. Add the files here (or elsewhere) and point to them from the JS data files. |

`index.html` is intentionally only a shell. It should not contain product copy.

The wiki and `reference.html` load the catalog and docs bundle before rendering. Article tools offer Copy, Print and the full HTML reference; configuration examples keep their own raw YAML/properties downloads. To edit an article, change its HTML source, rebuild the docs bundle, and validate its internal links before publishing. Metadata, groups, hubs and order remain in `docs-content.js`.

For documentation changes:

```bash
node tools/build-docs-bundle.mjs .
node tools/build-docs-bundle.mjs . --check
node tests/validate-theme.mjs
```

The first command writes `assets/js/generated/docs-bodies.js`; `--check` reports whether the committed bundle is stale without writing. Ordinary home, identity and UI edits need no docs build. Raw YAML/properties edits still use the separate config bundle command below.

## Configuration defaults

Actual plugin defaults are kept as ordinary YAML / properties files in `synced-configs/`. Documentation articles reference them with a `config-file` component instead of duplicating their contents.

`assets/js/generated/config-files.js` is an **automatic offline bundle**. Do not edit it manually. It exists so the same configuration pages work when the user opens `index.html` through `file://`, where browsers cannot reliably fetch adjacent local files.

To rebuild after changing a synchronized file locally:

```bash
node tools/build-config-bundle.mjs .
node tests/validate-theme.mjs
```

To pull the allowed defaults from a checkout of the private plugin repository:

```bash
node tools/sync-plugin-configs.mjs ../plugin .
node tools/build-config-bundle.mjs .
```

The allow-list is `tools/config-sync-map.mjs`. Runtime player/state data is intentionally excluded.

Wiki snippets and the full reference use locally bundled **Highlight.js 11.11.1**, including its properties grammar and BSD-3-Clause license. YAML, properties and supported labelled code blocks are highlighted after each article render; plain text and unknown labels are left unchanged. Token colors follow the light/dark theme, Copy retains the raw source text, and highlighting works offline without a CDN or package installation.

## GitHub automation

`.github/workflows/sync-plugin-configs.yml` can:

1. check out this website repository;
2. check out `IceWolf23X/CoreChatX-plugin` privately using `COREX_PLUGIN_READ_TOKEN`;
3. copy only the allow-listed public default configs;
4. rebuild the offline JavaScript bundle;
5. validate it;
6. commit only when published defaults changed.

The current branch-based Pages build publishes the repository root after a push to `main`. The optional `.github/workflows/deploy-pages.yml` publishes an allow-listed `_site/` artifact after Pages is configured to use GitHub Actions and `COREX_PAGES_ENABLED` is set to `true`. It supports pushes, manual requests and successful default/snapshot workflows. No website-write PAT is needed for that Actions deployment chain.

For push-triggered cross-repository synchronization, see `docs/GITHUB_SYNC.md` and `docs/examples/plugin-repository-notify.yml`.

## Offline behavior

Landing, wiki, local gallery assets and configuration snapshots are self-contained. Opening the Releases page lazily requests public GitHub metadata and caches it; offline it uses saved metadata or the bundled snapshot. Downloading remote JAR assets always requires Internet. No release API requests are made just to view the landing or wiki.

## Validation

Run:

```bash
node tests/validate-theme.mjs
node --test
node tests/browser_docs_content.cjs
python tests/browser_github_releases.py
python tests/browser_gallery.py
python tests/browser_smoke.py --embedded
python tests/browser_preview_hover.py --embedded
python tests/browser_ultrawide.py --embedded
```

`browser_docs_content.cjs` uses an available Node Playwright runtime and Chromium to verify the real offline `file://` entrypoints, all articles/configuration mounts and both article and configuration-key search. If Playwright is supplied outside this checkout, expose its package directory through `NODE_PATH` for that command; no repository dependency installation is required when the runtime is already available.

The Python browser harnesses cover mobile, ordinary desktop and ultrawide layouts through 32:9. Their original managed environment blocked native `file://` navigation, so the `--embedded` mode injects the exact shipped HTML/CSS/JS into a blank page. Landing/wiki/gallery regression tests verify no external requests; release UI tests use deterministic mocked API responses. Live public API access and GitHub Actions execution are separate checks.

## Releases / direct downloads

Publish a release in **IceWolf23X/CoreChatX-website**, attach `papermc.jar` and/or `velocity.jar`, and put the changelog in its Markdown description. No version folders or per-release JS edits are needed. The page reads the public API, caches metadata for 15 minutes and links directly to GitHub assets. It never downloads JARs merely to render the page.

Edit `releases` in `site-config.js` to change repository, filename patterns or cache settings. Run `node tools/build-releases.mjs .` only to refresh the optional offline snapshot. The matching workflow runs on release events, daily or manually. Errors preserve the prior snapshot; an authoritative empty response removes old entries.

**Full publishing and migration guide: [docs/GITHUB_RELEASES.md](docs/GITHUB_RELEASES.md).**

## Privacy and sitemap

See [Privacy and crawl-discovery maintenance](docs/PRIVACY_AND_SEO.md) for editable notice content, controller/contact, canonical page inventory and required generation checks.
