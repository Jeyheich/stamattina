import fs from 'node:fs';
import assert from 'node:assert/strict';
import {assemble,categories,romeDay} from './assemble_batches.mjs';
import {recordFailure} from './record_source_failure.mjs';
const now=Date.now(),today=romeDay(new Date(now)),stamp=new Date(now-60000).toISOString();
const original=JSON.parse(fs.readFileSync('dist/data/current.json'));
const photos=original.leadIds.map(id=>original.articles.find(a=>a.id===id).image);
const blocks={};
for(const [n,[slug,category]] of categories.entries()){
  blocks[slug]={schemaVersion:1,editionDate:today,category,completedAt:stamp,articles:[]};
  for(let i=0;i<5;i++){
    const a={id:`fixture-${slug}-${i}`,eventKey:`fixture-event-${slug}-${i}`,category,status:'verified',
      title:'Fixture locale, non una notizia',summary:'Test del controllo; mai pubblicare.',
      body:['Primo paragrafo di prova.','Secondo paragrafo di prova.'],publishedAt:stamp,verifiedAt:stamp,
      source:{name:'Fixture',url:`https://example.org/fixture/${slug}/${i}`,access:'free',accessCheckedAt:stamp,
        dateEvidence:'Data di prova creata esclusivamente in memoria.',reviewedBy:'Fixture locale'}};
    if(n<5&&i===0)a.image=structuredClone(photos[n]);blocks[slug].articles.push(a);
  }
}
const partial=structuredClone(blocks);delete partial.sport;
assert.equal(assemble(partial,today,now).edition,undefined,'Mai pubblicare sette categorie');
assert.deepEqual(assemble(partial,today,now).state.missing,['sport']);
const progress=structuredClone(blocks);progress.sport.status='in-progress';progress.sport.lastAttemptAt=stamp;delete progress.sport.completedAt;progress.sport.articles=progress.sport.articles.slice(0,3);
assert.equal(assemble(progress,today,now).edition,undefined);assert.deepEqual(assemble(progress,today,now).state.inProgress,[{slug:'sport',count:3}]);
const complete=assemble(blocks,today,now);assert.equal(complete.state.ready,true);
assert.equal(complete.edition.articles.length,40);assert.equal(complete.edition.compactIds.length,35);
assert.equal(complete.edition.leadIds.length,5);
const extraPhoto=structuredClone(blocks);extraPhoto.sport.articles[0].image=structuredClone(photos[0]);extraPhoto.sport.articles[0].image.sourceUrl+='?fixture=distinct';
const pruned=assemble(extraPhoto,today,now);assert.equal(pruned.edition.articles.filter(a=>a.image).length,5,'Le compatte restano compatte e solo le cinque foto pubblicate vengono selezionate');
assert.equal(assemble(blocks,today,now+10000).edition.id,complete.edition.id,'Una ripresa immutata mantiene id edizione');
const yesterday=structuredClone(blocks);yesterday.roma.editionDate='2000-01-01';assert.equal(assemble(yesterday,today,now).edition,undefined);
const expired=structuredClone(blocks);expired.roma.completedAt=new Date(now-14400000).toISOString();assert.equal(assemble(expired,today,now).edition,undefined);
const duplicate=structuredClone(blocks);duplicate.sport.articles[0].eventKey=duplicate.esteri.articles[0].eventKey;assert.equal(assemble(duplicate,today,now).state.ready,false);
const insufficientPhotos=structuredClone(blocks);delete insufficientPhotos.roma.articles[0].image;assert.equal(assemble(insufficientPhotos,today,now).state.photosMissing,1);
const sourceDuplicate=structuredClone(blocks);sourceDuplicate.sport.articles[0].source.url=sourceDuplicate.esteri.articles[0].source.url;assert.equal(assemble(sourceDuplicate,today,now).state.ready,false);
const blocked=recordFailure(complete.state,complete.edition,'check_photo: fixture-economia-0: HTTP Error 403');assert.equal(blocked.ready,false);assert.equal(blocked.invalid[0].slug,'economia');assert(!blocked.completed.includes('economia'));assert(blocked.completed.includes('politica'));
const refresh=structuredClone(blocks);refresh.politica.collectionId=today+'-pomeriggio';
assert.equal(assemble(refresh,today,now).edition,undefined,'Il nuovo ciclo non pubblica insieme ai vecchi blocchi');
assert.equal(assemble(refresh,today,now).state.missing.length,7);
for(const b of Object.values(refresh))b.collectionId=today+'-pomeriggio';
assert.equal(assemble(refresh,today,now).edition.articles.length,40,'Otto blocchi del ciclo nuovo pubblicano');
refresh.sport.collectionId=today+'-altro';assert.equal(assemble(refresh,today,now).state.ready,false,'Cicli discordanti bloccati');
console.log('PASS: ripresa dopo 7 blocchi, 40 schede/35 compatte, id stabile; date vecchie, verifiche scadute, fatti/fonti duplicati e foto insufficienti bloccati. Fixture solo in memoria.');

const withReserve=structuredClone(blocks);
for(const [slug,b] of Object.entries(withReserve)){b.reserveArticles=b.articles.map((a,i)=>{const x=structuredClone(a);x.id+='-extra';x.eventKey+='-extra';x.source.url+='-extra';delete x.image;return x;});}
const expanded=assemble(withReserve,today,now);assert.equal(expanded.state.ready,true);assert.equal(expanded.edition.articles.length,80);assert.equal(expanded.edition.reserveIds.length,40);assert.equal(expanded.edition.compactIds.length,35);assert.equal(expanded.edition.leadIds.length,5);
const badReserve=structuredClone(withReserve);badReserve.sport.reserveArticles[0].eventKey=badReserve.esteri.articles[0].eventKey;assert.equal(assemble(badReserve,today,now).edition,undefined);
const shortReserve=structuredClone(withReserve);shortReserve.sport.reserveArticles.pop();assert.equal(assemble(shortReserve,today,now).edition,undefined);
const oldReserve=structuredClone(withReserve);oldReserve.sport.reserveArticles[0].verifiedAt='2000-01-01T00:00:00Z';assert.equal(assemble(oldReserve,today,now).edition,undefined);
if(process.env.WRITE_UI_FIXTURE)fs.writeFileSync(process.env.WRITE_UI_FIXTURE,JSON.stringify({...expanded.edition,mode:'demo',articles:expanded.edition.articles.map(a=>({...a,status:'example',title:a.id.includes('-extra')?'ESEMPIO — Notizia aggiuntiva '+a.category:'ESEMPIO — Notizia '+a.category}))}));
console.log('PASS: riserva 5 per categoria, 80 totali con 40 iniziali; duplicati, parziali e scadenze respinti.');

// Completeness is editorial, not merely a technically publishable base edition.
assert.equal(complete.state.editorialComplete,false);
assert.deepEqual(complete.state.reserveMissing,categories.map(([slug])=>slug));
const techOnly=structuredClone(blocks);techOnly.tecnologia.reserveArticles=structuredClone(withReserve.tecnologia.reserveArticles);
const limited=assemble(techOnly,today,now);
assert.equal(limited.state.ready,true,'La base verificata rimane pubblicabile');
assert.equal(limited.state.editorialComplete,false,'45 articoli non completano la rassegna richiesta');
assert.equal(limited.state.reserveMissing.length,7);
assert.equal(limited.state.categoryProgress.tecnologia.complete,true);
assert.equal(limited.state.categoryProgress.sport.complete,false);
assert.equal(expanded.state.editorialComplete,true);
assert.deepEqual(expanded.state.reserveMissing,[]);
assert.equal(assemble(badReserve,today,now).state.editorialComplete,false);
console.log('PASS: 40 o 45 articoli dichiarano riserve mancanti; soltanto 80 validi completano il lavoro editoriale.');
