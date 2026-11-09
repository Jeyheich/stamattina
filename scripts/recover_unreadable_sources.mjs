import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assemble, categories, runAssembly, validateBlock } from './assemble_batches.mjs';
import { cyclePath, readBlocks, writeJSON } from './editorial_cycles.mjs';

const techGroup = name => name === 'Punto Informatico' ? name : 'videogiochi';

export function planSourceRecovery(blocks, edition, failures, checkArticle, now = Date.now()) {
  if (!failures.length || failures.some(failure => failure.check !== 'check_article')) return null;
  const failedIds = new Set(failures.map(failure => failure.id));
  const result = structuredClone(blocks);
  const replacements = [];
  const used = new Set(edition.articles.flatMap(a => [a.id, a.eventKey, a.source.url]));
  const verified = new Map();
  const slots = [];
  for (const [slug] of categories) {
    const block = result[slug];
    for (const section of ['articles', 'reserveArticles']) {
      for (const [index, article] of (block?.[section] ?? []).entries()) {
        if (failedIds.has(article.id)) slots.push({ slug, block, section, index, article });
      }
    }
  }
  if (slots.length !== failedIds.size) return null;

  function fill(position) {
    if (position === slots.length) {
      const proposed = assemble(result, edition.editionDate, now, edition.collectionId);
      return proposed.state.editorialComplete ? proposed.edition : null;
    }
    const { slug, block, section, index, article } = slots[position];
    const alternates = block.fallbackArticles;
    if (!Array.isArray(alternates) || alternates.length > 2) return null;
    for (const candidate of alternates) {
      const keys = [candidate?.id, candidate?.eventKey, candidate?.source?.url];
      if (keys.some(key => !key || used.has(key))) continue;
      if (slug === 'tecnologia' && (!['Punto Informatico', 'Everyeye', 'IGN Italia'].includes(candidate.source.name)
          || techGroup(article.source.name) !== techGroup(candidate.source.name))) continue;
      const testArticles = block[section].slice();
      testArticles[index] = candidate;
      try {
        validateBlock({ ...block, articles: testArticles }, slug, edition.editionDate, now);
      } catch {
        continue;
      }
      if (!verified.has(candidate)) verified.set(candidate, checkArticle(candidate));
      if (!verified.get(candidate)) continue;
      keys.forEach(key => used.add(key));
      block[section][index] = candidate;
      replacements.push({ slug, previousId: article.id, replacementId: candidate.id });
      const recovered = fill(position + 1);
      if (recovered) return recovered;
      replacements.pop();
      block[section][index] = article;
      keys.forEach(key => used.delete(key));
    }
    return null;
  }

  const recovered = fill(0);
  return recovered && { blocks: result, edition: recovered, replacements };
}

function recover(failureFile) {
  const incoming = JSON.parse(fs.readFileSync('incoming/edition.json'));
  const root = 'automation/editorial';
  const { collectionId } = incoming;
  const directory = cyclePath(root, collectionId);
  const failures = JSON.parse(fs.readFileSync(failureFile));
  const plan = planSourceRecovery(readBlocks(root, collectionId), incoming, failures, article => {
    try {
      execFileSync('python3', ['scripts/verify_sources.py', '--check-article'], {
        input: JSON.stringify(article), stdio: ['pipe', 'ignore', 'pipe'],
      });
      return true;
    } catch {
      return false;
    }
  });
  if (!plan) throw Error('Nessuna combinazione di scorte valide per le fonti respinte');

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stamattina-scorte-'));
  try {
    const file = path.join(temp, 'edition.json');
    writeJSON(file, plan.edition);
    execFileSync('python3', ['scripts/verify_sources.py', file], { stdio: 'inherit' });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }

  const ledgerPath = path.join(directory, 'branch-imports.json');
  const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath)) : null;
  for (const slug of new Set(plan.replacements.map(item => item.slug))) {
    const block = plan.blocks[slug];
    const consumed = new Set(plan.replacements.filter(item => item.slug === slug).map(item => item.replacementId));
    block.fallbackArticles = block.fallbackArticles.filter(article => !consumed.has(article.id));
    const file = path.join(directory, slug + '.json');
    writeJSON(file, block);
    if (ledger?.[slug]) ledger[slug].stored = execFileSync('git', ['hash-object', file], { encoding: 'utf8' }).trim();
  }
  if (ledger) writeJSON(ledgerPath, ledger);
  const result = runAssembly({ root, cycle: collectionId });
  if (!result.state.needsPublication || result.edition?.id !== plan.edition.id) {
    throw Error('L’edizione riassemblata non coincide con quella appena verificata');
  }
  result.state.sourceReplacements = plan.replacements;
  writeJSON(path.join(directory, 'status.json'), result.state);
  writeJSON(path.join(root, 'status.json'), result.state);
  console.log('Fonti recuperate:', JSON.stringify(plan.replacements));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) recover(process.argv[2]);
