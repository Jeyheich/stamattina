import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cyclePath, parseCycle, writeJSON } from './editorial_cycles.mjs';

const desks = {
  'redazione-quotidiana': ['politica', 'esteri', 'tecnologia', 'sport'],
  'redazione-economia-cronaca': ['economia', 'cronaca', 'roma', 'cultura'],
};
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const blob = (ref, file) => git('ls-tree', ref, '--', file).split(/\s+/)[2] ?? null;

export function importEditorialBranches(root, cycle) {
  const directory = cyclePath(root, cycle);
  const { day } = parseCycle(cycle);
  const ledgerFile = path.join(directory, 'branch-imports.json');
  const ledger = fs.existsSync(ledgerFile) ? JSON.parse(fs.readFileSync(ledgerFile)) : {};
  const updates = [];
  for (const [desk, slugs] of Object.entries(desks)) {
    const tip = git('rev-parse', 'refs/remotes/origin/' + desk);
    const base = git('merge-base', 'HEAD', tip);
    for (const slug of slugs) {
      const file = path.join(directory, slug + '.json');
      const incoming = blob(tip, file);
      const seed = blob(base, file);
      const previous = ledger[slug];
      if (!incoming || incoming === (previous?.source ?? seed)) continue;
      const current = blob('HEAD', file);
      if (current !== (previous?.stored ?? seed) && current !== incoming) {
        throw Error('Conflitto tra main e ' + desk + ' per ' + file + '. Conservati entrambi.');
      }
      const data = JSON.parse(git('cat-file', 'blob', incoming));
      if (data.collectionId !== cycle || data.editionDate !== day) {
        throw Error('Ciclo incoerente in ' + desk + ':' + file);
      }
      updates.push({ file, data, slug, incoming });
    }
  }
  for (const { file, data, slug, incoming } of updates) {
    writeJSON(file, data);
    // Track the stored blob, including any JSON formatting normalization.
    ledger[slug] = { source: incoming, stored: git('hash-object', file) };
  }
  if (updates.length) writeJSON(ledgerFile, ledger);
  return updates.map(({ slug }) => slug);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Blocchi importati:', importEditorialBranches('automation/editorial', process.env.EDITORIAL_COLLECTION_ID));
}
