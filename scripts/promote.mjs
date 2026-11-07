import fs from 'node:fs';import assert from 'node:assert/strict';import {validate} from './validate.mjs';import {assemble} from './assemble_batches.mjs';import {parseCycle,readBlocks} from './editorial_cycles.mjs';
// Manual editorial gate. The scheduler never invents or scrapes stories.
const path='incoming/edition.json';if(!fs.existsSync(path)){console.log('Nessuna edizione revisionata: mantengo quella precedente.');process.exit(0)}const e=JSON.parse(fs.readFileSync(path));const stateFile='automation/editorial/status.json';const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile)):null;
if(!state?.ready||!state.needsPublication){console.log('Nessun nuovo ciclo pronto: mantengo dati pubblici e archivio.');process.exit(0);}
validate(e,true,true);parseCycle(e.collectionId);assert.equal(state.collectionId,e.collectionId);assert.equal(state.editionId,e.id);
const checked=assemble(readBlocks('automation/editorial',e.collectionId),e.editionDate,Date.now(),e.collectionId);
assert(checked.state.ready,'Checkpoint non piu validi');assert.equal(checked.edition.id,e.id,'Checkpoint modificati dopo assemblaggio');
if(fs.existsSync('dist/data/current.json')){const current=JSON.parse(fs.readFileSync('dist/data/current.json'));assert(!current.collectionId||e.collectionId>=current.collectionId,'Regressione del ciclo pubblico');}
const today = new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Rome'}).format(new Date());
if (e.editionDate !== today) {
 const event = process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' && process.env.GITHUB_EVENT_PATH
  ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
  : null;
 assert(e.editionDate < today && event?.inputs?.recoverOlderEdition === 'true' && event.inputs.collectionId === e.collectionId,
  'Edizione arretrata: occorre selezionare esplicitamente il ciclo in un avvio manuale');
 assert(checked.state.editorialComplete, 'Edizione arretrata: servono tutte le 40 principali e le 40 aggiuntive');
}
for(const a of e.articles)if(a.image&&!a.image.src.startsWith('https://')&&!fs.existsSync('dist/'+a.image.src))throw Error('Fotografia locale mancante: '+a.id);fs.mkdirSync('dist/data/archive',{recursive:true});const archiveEdition=edition=>{if(!/^[a-z0-9][a-z0-9-]{2,160}$/.test(edition.id))throw Error('ID archivio non valido');fs.writeFileSync('dist/data/archive/'+edition.id+'.json',JSON.stringify(edition,null,2)+'\n')};if(fs.existsSync('dist/data/current.json'))archiveEdition(JSON.parse(fs.readFileSync('dist/data/current.json')));archiveEdition(e);const out=JSON.stringify(e,null,2)+'\n';fs.writeFileSync('dist/data/archive/'+e.editionDate+'.json',out);fs.writeFileSync('dist/data/archive/'+e.collectionId+'.json',out);fs.writeFileSync('dist/data/current.json.tmp',out);fs.renameSync('dist/data/current.json.tmp','dist/data/current.json');console.log('Edizione revisionata promossa: '+e.editionDate);
