import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {assemble,runAssembly,categories,romeDay} from './assemble_batches.mjs';
import {cyclePath,readBlocks,writeJSON,ingestLegacy,selectCycle} from './editorial_cycles.mjs';
const original=JSON.parse(fs.readFileSync('dist/data/current.json'));
const now=Date.now(),day=romeDay(new Date(now)),stamp=new Date(now-60000).toISOString();
const photos=original.leadIds.map(id=>original.articles.find(a=>a.id===id).image);
function fixtures(slot){
 const blocks={};
 for(const [n,[slug,category]] of categories.entries()){
  const articles=Array.from({length:10},(_,i)=>({id:'test-'+slug+'-'+i,eventKey:'test-event-'+slug+'-'+i,category,status:'verified',title:'TEST - mai pubblicare',summary:'Fixture solo temporanea',body:['Paragrafo di prova.','Altro paragrafo di prova.'],publishedAt:stamp,verifiedAt:stamp,source:{name:'Fixture',url:'https://example.org/'+slug+'/'+i,access:'free',accessCheckedAt:stamp,dateEvidence:'Data fittizia soltanto per test in memoria.',reviewedBy:'Test'}}));
  if(n<5)articles[0].image=structuredClone(photos[n]);
  blocks[slug]={schemaVersion:1,editionDate:day,collectionId:day+'-'+slot,category,completedAt:stamp,articles:articles.slice(0,5),reserveArticles:articles.slice(5)};
 }
 return blocks;
}
const am=fixtures('mattina'),pm=fixtures('pomeriggio');
const cwd=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'stamattina-cycles-'));
const promote=fileURLToPath(new URL('./promote.mjs',import.meta.url));
let checks=0;
function ok(name,fn){fn();checks++;console.log('PASS '+name);}
try{
 process.chdir(temp);
 const root='automation/editorial';
 function save(blocks){for(const [slug,b] of Object.entries(blocks))writeJSON(path.join(cyclePath(root,b.collectionId),slug+'.json'),b);}
 save(am);
 const morning=assemble(readBlocks(root,day+'-mattina'),day,now,day+'-mattina');
 writeJSON('dist/data/current.json',morning.edition);
 const publicBefore=fs.readFileSync('dist/data/current.json','utf8');
 ok('mattina completa, pomeriggio assente',()=>{assert(morning.state.editorialComplete);const r=runAssembly({cycle:day+'-pomeriggio',now});assert.equal(r.state.missing.length,8);assert(!r.state.ready);});
 ok('pomeriggio parziale indipendente',()=>{save({politica:pm.politica});const r=runAssembly({cycle:day+'-pomeriggio',now});assert(!r.state.ready);assert.equal(r.state.completed.length,1);assert.equal(fs.readFileSync('dist/data/current.json','utf8'),publicBefore);});
 ok('checkpoint 1-4 principali e ripresa dopo interruzione',()=>{for(let n=1;n<=4;n++){const b=structuredClone(pm.sport);b.status='in-progress';b.lastAttemptAt=stamp;delete b.completedAt;b.articles=b.articles.slice(0,n);save({sport:b});assert.equal(readBlocks(root,b.collectionId).sport.articles.length,n);assert(!runAssembly({cycle:b.collectionId,now}).state.ready);}save({sport:pm.sport});assert.equal(readBlocks(root,day+'-pomeriggio').sport.articles.length,5);});
 ok('5 principali e 1-4 reserveDraft, nessuna bozza pubblicata',()=>{for(let n=1;n<=4;n++){const b=structuredClone(pm);b.sport.reserveDraft=b.sport.reserveArticles.slice(0,n);delete b.sport.reserveArticles;const r=assemble(b,day,now,day+'-pomeriggio');assert(r.state.ready);assert(!r.state.editorialComplete);assert.equal(r.state.categoryProgress.sport.draft,n);assert.equal(r.edition.reserveIds.length,35);}});
 ok('blocco ciclo errato esplicitamente rifiutato',()=>{const b=structuredClone(pm);b.roma=am.roma;const r=assemble(b,day,now,day+'-pomeriggio');assert(!r.edition);assert(r.state.invalid.some(x=>x.slug==='roma'&&x.reason.includes('collectionId')));});
 ok('duplicati globali tra categorie e riserve',()=>{for(const field of ['id','eventKey']){const b=structuredClone(pm);b.sport.reserveArticles[0][field]=b.esteri.articles[0][field];assert(!assemble(b,day,now,day+'-pomeriggio').edition);}});
 ok('verifiche oltre tre ore, timestamp blocco non rinnova articoli',()=>{const b=structuredClone(pm);b.roma.articles[0].verifiedAt=new Date(now-10800001).toISOString();assert(!assemble(b,day,now,day+'-pomeriggio').edition);});
 ok('due cicli completi persistenti senza sovrascrittura',()=>{save(pm);assert.deepEqual(readBlocks(root,day+'-mattina'),am);assert.deepEqual(readBlocks(root,day+'-pomeriggio'),pm);assert(runAssembly({cycle:day+'-pomeriggio',now}).state.editorialComplete);});
 ok('promozione preserva entrambe le edizioni e archivio per ciclo',()=>{execFileSync(process.execPath,[promote]);const afternoon=JSON.parse(fs.readFileSync('dist/data/current.json'));assert.equal(afternoon.collectionId,day+'-pomeriggio');assert.deepEqual(JSON.parse(fs.readFileSync('dist/data/archive/'+morning.edition.id+'.json')),morning.edition);assert.equal(JSON.parse(fs.readFileSync('dist/data/archive/'+day+'-pomeriggio.json')).id,afternoon.id);});
 ok('ritardo del mattino non fa regredire il pubblico',()=>{const before=fs.readFileSync('dist/data/current.json','utf8');assert(!runAssembly({cycle:day+'-mattina',now}).state.needsPublication);execFileSync(process.execPath,[promote]);assert.equal(fs.readFileSync('dist/data/current.json','utf8'),before);});
 ok('nessuna nuova edizione pronta: incoming obsoleto non pubblicato',()=>{const before=fs.readFileSync('dist/data/current.json','utf8');fs.unlinkSync(path.join(cyclePath(root,day+'-pomeriggio'),'roma.json'));runAssembly({cycle:day+'-pomeriggio',now});execFileSync(process.execPath,[promote]);assert.equal(fs.readFileSync('dist/data/current.json','utf8'),before);save({roma:pm.roma});});
 ok('arretrato completo solo con avvio manuale e ciclo esplicito',()=>{
  const oldDay=romeDay(new Date(now-86400000));
  const oldCycle=oldDay+'-pomeriggio';
  const blocks=structuredClone(pm);
  for(const block of Object.values(blocks)){
   block.editionDate=oldDay;
   block.collectionId=oldCycle;
   for(const article of [...block.articles,...block.reserveArticles]) article.publishedAt=oldDay;
  }
  const current=JSON.parse(fs.readFileSync('dist/data/current.json'));
  writeJSON('dist/data/current.json',{...original,collectionId:undefined});
  save(blocks);
  assert(!runAssembly({cycle:oldCycle,now}).state.needsPublication);
  process.env.EDITORIAL_RECOVERY='true';
  assert(runAssembly({cycle:oldCycle,now}).state.needsPublication);
  writeJSON('test-event.json',{inputs:{collectionId:oldCycle,recoverOlderEdition:'true'}});
  const manual={...process.env,GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_EVENT_PATH:path.resolve('test-event.json')};
  const automatic={...manual,GITHUB_EVENT_NAME:'push'};
  assert.throws(()=>execFileSync(process.execPath,[promote],{env:automatic,stdio:'pipe'}),/occorre selezionare/);
  delete blocks.sport.reserveArticles;
  save(blocks);
  assert(!runAssembly({cycle:oldCycle,now}).state.needsPublication);
  save({sport:{...blocks.sport,reserveArticles:pm.sport.reserveArticles.map(a=>({...a,publishedAt:oldDay}))}});
  assert(runAssembly({cycle:oldCycle,now}).state.editorialComplete);
  execFileSync(process.execPath,[promote],{env:manual,stdio:'pipe'});
  const recovered=JSON.parse(fs.readFileSync('dist/data/current.json'));
  assert.equal(recovered.collectionId,oldCycle);
  assert.equal(recovered.editionDate,oldDay);
  assert.equal(recovered.articles.length,80);
  delete process.env.EDITORIAL_RECOVERY;
  writeJSON('dist/data/current.json',current);
 });
 ok('migrazione legacy ripetibile, originali e parziali conservati',()=>{const legacy=path.join(root,day,'politica.json');writeJSON(legacy,pm.politica);assert.deepEqual(ingestLegacy(root,day),[]);const saved=fs.readFileSync(path.join(root,day,'legacy-imports.json'),'utf8');assert.deepEqual(ingestLegacy(root,day),[]);assert.equal(fs.readFileSync(path.join(root,day,'legacy-imports.json'),'utf8'),saved);assert.deepEqual(JSON.parse(fs.readFileSync(legacy)),pm.politica);assert.deepEqual(readBlocks(root,day+'-mattina'),am);});
 ok('conflitto non sovrascrive il canonico',()=>{const b=structuredClone(pm.politica);b.articles[0].title='Conflitto stesso timestamp';writeJSON(path.join(root,day,'politica.json'),b);assert(ingestLegacy(root,day).length);assert.deepEqual(readBlocks(root,day+'-pomeriggio').politica,pm.politica);});
 ok('selettore workflow legge il ciclo nel commit originale, non nel checkout nuovo',()=>{
  const selector=fileURLToPath(new URL('./select_editorial_cycle.mjs',import.meta.url));
  const repo=path.join(temp,'event-test');fs.mkdirSync(repo);process.chdir(repo);
  execFileSync('git',['init','-q']);execFileSync('git',['config','user.email','fixture@example.org']);execFileSync('git',['config','user.name','Fixture']);
  writeJSON('initial.json',{});execFileSync('git',['add','.']);execFileSync('git',['commit','-qm','initial']);
  const before=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const file=path.join(root,day,'politica.json');writeJSON(file,am.politica);execFileSync('git',['add','.']);execFileSync('git',['commit','-qm','morning']);
  const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  writeJSON(file,pm.politica);execFileSync('git',['add','.']);execFileSync('git',['commit','-qm','afternoon']);
  const event=path.join(repo,'event.json'),envFile=path.join(repo,'env');
  writeJSON(event,{before,head_commit:{timestamp:day+'T22:00:00Z'}});
  execFileSync(process.execPath,[selector],{env:{...process.env,GITHUB_EVENT_PATH:event,GITHUB_EVENT_NAME:'push',GITHUB_SHA:sha,GITHUB_ENV:envFile}});
  assert(fs.readFileSync(envFile,'utf8').includes('EDITORIAL_COLLECTION_ID='+day+'-mattina'));
  process.chdir(temp);
 });
 ok('selezione ritardata, giorno previsto e cambio ora Europe/Rome',()=>{
  assert.equal(selectCycle({explicit:day+'-mattina',now:new Date(day+'T22:00:00Z')}),day+'-mattina');
  assert.equal(selectCycle({scheduledAt:'2026-07-03T04:05:00Z',now:new Date('2026-07-04T20:00:00Z')}),'2026-07-03-mattina');
  for(const date of ['2026-03-29','2026-10-25']){
   assert.equal(selectCycle({scheduledAt:date+'T05:05:00Z'}),date+'-mattina');
   assert.equal(selectCycle({scheduledAt:date+'T16:05:00Z'}),date+'-pomeriggio');
  }
 });
 ok('offset obiettivi estate e inverno',()=>{for(const [date,offset] of [['2026-07-03','+02:00'],['2026-11-04','+01:00']]){const b=structuredClone(pm),time=Date.parse(date+'T16:00:00Z');for(const v of Object.values(b)){v.editionDate=date;v.collectionId=date+'-pomeriggio';v.completedAt=new Date(time).toISOString();for(const a of [...v.articles,...v.reserveArticles]){a.verifiedAt=v.completedAt;a.publishedAt=v.completedAt;a.source.accessCheckedAt=v.completedAt;}}const r=assemble(b,date,time,date+'-pomeriggio');assert(r.edition.scheduledFor.endsWith('T19:00:00'+offset));}});
 // Reconstruct two historical commits in an isolated Git repository.
 ok('recupero cronologia dopo sovrascrittura legacy',()=>{
  const recover=path.join(temp,'recover');fs.mkdirSync(recover);process.chdir(recover);
  execFileSync('git',['init','-q']);execFileSync('git',['config','user.email','fixture@example.org']);execFileSync('git',['config','user.name','Fixture']);
  const file=path.join(root,day,'sport.json');
  for(const b of [am.sport,pm.sport]){writeJSON(file,b);execFileSync('git',['add','.']);execFileSync('git',['commit','-qm','Fixture checkpoint']);}
  assert.deepEqual(ingestLegacy(root,day,{history:true}),[]);
  assert.deepEqual(readBlocks(root,day+'-mattina').sport,am.sport);
  assert.deepEqual(readBlocks(root,day+'-pomeriggio').sport,pm.sport);
  assert.deepEqual(ingestLegacy(root,day,{history:true}),[]);
  process.chdir(temp);
 });
}finally{process.chdir(cwd);fs.rmSync(temp,{recursive:true,force:true});}
console.log('PASS '+checks+' scenari persistenti; fixture soltanto temporanee, nessuna fonte o data reale modificata.');
