import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { preparePages } from '../tools/prepare-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

// Old bookmarked pages must select the corresponding maintained wiki section.
test('legacy page routes preserve migration and configuration bookmarks', () => {
  const { target } = require('../assets/js/legacy-routes.js');
  assert.equal(target('migration-paper.html', '#step-1'), 'index.html#/docs/guides/migration-paper~step-1');
  assert.equal(target('configuration.html', '#4-9-chatitems-yml'), 'index.html#/docs/paper/chatitems-yml');
  assert.equal(target('advancement-sync.html', '#credentials'), 'index.html#/docs/guides/advancement-sync~credentials');
  assert.equal(target('changelog.html', '#release-2026-3-2'), 'index.html#/docs/reference/changelog~release-2026-3-2');
  assert.equal(target('configuration.html', '#storage-maintenance'), 'index.html#/docs/paper/storage-yml~storage-maintenance-and-migration-workflow');
  assert.equal(target('configuration.html', '#channel-persistence'), 'index.html#/docs/reference/per-player-channel-persistence');
  assert.equal(target('unknown.html', '#anything'), 'index.html#/docs/instructions');
});

// Every preserved page and configured bookmark must lead to a real authored article or section.
test('all legacy routes resolve to maintained wiki sources', async () => {
  const { routes } = require('../assets/js/legacy-routes.js');
  const context = vm.createContext({ window: {} });
  vm.runInContext(await fs.readFile(path.join(root, 'assets/js/data/docs-content.js'), 'utf8'), context);
  const articles = new Map(context.window.COREX_DOCS.articles.map(article => [article.id, article]));
  for (const [page, entry] of Object.entries(routes)) {
    await fs.access(path.join(root, page));
    for (const route of [entry.route, ...Object.values(entry.anchors || {})]) {
      const [id, anchor] = route.slice('#/docs/'.length).split('~');
      if (id === 'instructions') continue;
      assert.ok(articles.has(id), page + ': ' + route);
      if (anchor) {
        const body = await fs.readFile(path.join(root, articles.get(id).bodyFile), 'utf8');
        assert.ok(body.includes('id="' + anchor + '"'), page + ': ' + route);
      }
    }
  }
});

// Pages packaging must retain the existing domain, ownership response and legacy entrypoints.
test('Pages artifact includes compatibility pages and production metadata when present', async t => {
  const os = await import('node:os');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'corechatx-legacy-pages-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const entry of ['assets', 'synced-configs']) await fs.mkdir(path.join(dir, entry));
  const files = ['index.html', 'reference.html', 'migration-paper.html', 'advancement-sync.html', 'CNAME', 'robots.txt', 'sitemap.xml', 'googlee11c6bb42d6e0aeb.html'];
  for (const file of files) await fs.writeFile(path.join(dir, file), file + '\n');
  await fs.writeFile(path.join(dir, 'private-notes.html'), 'must stay private');
  const output = await preparePages(dir);
  for (const file of files) assert.equal(await fs.readFile(path.join(output, file), 'utf8'), file + '\n');
  await assert.rejects(fs.access(path.join(output, 'private-notes.html')));
});
