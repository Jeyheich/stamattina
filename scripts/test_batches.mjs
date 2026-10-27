import fs from 'node:fs';
import assert from 'node:assert/strict';
import {assemble,categories,romeDay} from './assemble_batches.mjs';
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
console.log('PASS: ripresa dopo 7 blocchi, 40 schede/35 compatte, id stabile; date vecchie, verifiche scadute, fatti/fonti duplicati e foto insufficienti bloccati. Fixture solo in memoria.');
