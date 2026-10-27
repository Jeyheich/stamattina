import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {validate} from './validate.mjs';

export const categories = [
  ['politica','Politica'],['esteri','Esteri'],['economia','Economia'],
  ['cronaca','Cronaca'],['roma','Roma'],['cultura','Cultura · Teatro · Cinema'],
  ['tecnologia','Tecnologia · AI'],['sport','Sport'],
];
export const romeDay = (date=new Date()) => new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome'}).format(date);
function recent(value,now){const t=Date.parse(value);assert(Number.isFinite(t),'Data di verifica mancante');assert(t<=now+300000&&now-t<=10800000,'Verifica scaduta o futura');}
export function validateBlock(block,slug,today,now=Date.now(),partial=false){
  const name=categories.find(([s])=>s===slug)?.[1];
  assert(name,'Categoria sconosciuta');assert.equal(block.schemaVersion,1);
  assert.equal(block.editionDate,today,'Blocco di un altro giorno');
  assert.equal(block.category,name,'Categoria del file errata');recent(partial?block.lastAttemptAt:block.completedAt,now);
  assert(Array.isArray(block.articles)&&(partial?block.articles.length>=1&&block.articles.length<5:block.articles.length===5),'Il blocco completo deve contenere 5 notizie distinte');
  for(const a of block.articles){
    assert.equal(a.category,name);assert.equal(a.status,'verified');
    assert(typeof a.id==='string'&&/^[a-z0-9][a-z0-9-]{2,100}$/.test(a.id),'ID non valido');
    assert(typeof a.eventKey==='string'&&/^[a-z0-9][a-z0-9-]{5,160}$/.test(a.eventKey),'Manca eventKey del fatto');
    assert(a.title?.trim()&&a.summary?.trim(),'Titolo o sintesi mancanti');
    assert(Array.isArray(a.body)&&a.body.length&&a.body.every(p=>typeof p==='string'&&p.trim()),'Approfondimento mancante');
    assert(Number.isFinite(Date.parse(a.publishedAt)),'Data fonte mancante');
    if(a.dateKind!=='event')assert(Date.parse(a.publishedAt)<=now+300000,'Pubblicazione futura');
    recent(a.verifiedAt,now);recent(a.source?.accessCheckedAt,now);
    assert.equal(a.source?.access,'free');assert.equal(new URL(a.source.url).protocol,'https:');
    assert(a.source.name?.trim()&&a.source.dateEvidence?.length>=20&&a.source.reviewedBy?.trim(),'Evidenze fonte incomplete');
    if(a.image){
      for(const k of ['src','sourceUrl','credit','rights','licenseUrl','caption','alt'])assert(a.image[k]?.trim(),'Metadato foto mancante: '+k);
      assert.equal(a.image.reuseApproved,true);assert.equal(new URL(a.image.src).protocol,'https:');
      assert(a.body.length>=2,'Una candidata principale con foto richiede almeno due paragrafi');
    }
    if(a.leadPriority!==undefined)assert(Number.isFinite(a.leadPriority)&&a.leadPriority>=0&&a.leadPriority<=100,'Priorità non valida');
  }
  assert.equal(new Set(block.articles.map(a=>a.id)).size,block.articles.length,'ID ripetuti');
  assert.equal(new Set(block.articles.map(a=>a.eventKey)).size,block.articles.length,'Stesso fatto ripetuto');
  return block;
}
export function assemble(blocks,today=romeDay(),now=Date.now()){
  const state={editionDate:today,checkedAt:new Date(now).toISOString(),ready:false,completed:[],inProgress:[],missing:[],invalid:[],stories:[]};
  const articles=[],reserves=[];
  // A same-day refresh must not mix freshly reviewed blocks with the earlier edition.
  const cycles=[...new Set(Object.values(blocks).filter(b=>b.editionDate===today).map(b=>b.collectionId).filter(Boolean))];
  if(cycles.length>1){state.invalid.push({slug:'edition',reason:'Cicli editoriali differenti'});return {state};}
  const cycle=cycles[0];if(cycle)state.collectionId=cycle;
  for(const [slug,name] of categories){
    if(!blocks[slug]){state.missing.push(slug);continue;}
    if(cycle&&blocks[slug].collectionId!==cycle){state.missing.push(slug);continue;}
    try{
      const partial=blocks[slug].status==='in-progress';validateBlock(blocks[slug],slug,today,now,partial);
      if(partial){state.inProgress.push({slug,count:blocks[slug].articles.length});state.stories.push(...blocks[slug].articles.map(({id,category,title,eventKey})=>({id,category,title,eventKey,pending:true})));}
      else{if(blocks[slug].reserveArticles!==undefined){validateBlock({...blocks[slug],articles:blocks[slug].reserveArticles},slug,today,now);reserves.push(...blocks[slug].reserveArticles.map(a=>{const copy={...a};delete copy.image;delete copy.leadPriority;return copy;}));}state.completed.push(slug);articles.push(...blocks[slug].articles);}
    }
    catch(e){state.invalid.push({slug,reason:e.message});}
  }
  state.stories.push(...[...articles,...reserves].map(({id,category,title,eventKey})=>({id,category,title,eventKey})));
  state.reserveCounts=Object.fromEntries(categories.map(([,name])=>[name,reserves.filter(a=>a.category===name).length]));
  state.photoCandidates=articles.filter(a=>a.image).map(a=>({id:a.id,category:a.category,sourceUrl:a.image.sourceUrl}));
  state.photosAvailable=new Set(state.photoCandidates.map(a=>a.sourceUrl)).size;
  if(state.missing.length||state.invalid.length||state.inProgress.length)return {state};
  try{
    assert.equal(new Set(articles.map(a=>a.id)).size,40,'ID duplicati tra categorie');
    assert.equal(new Set([...articles,...reserves].map(a=>a.id)).size,40+reserves.length,'ID duplicato nella riserva');assert.equal(new Set([...articles,...reserves].map(a=>a.eventKey)).size,40+reserves.length,'Fatto duplicato tra categorie o riserva');
    const photoSources=new Set();
    const photoCandidates=articles.filter(a=>a.image).sort((a,b)=>(b.leadPriority||0)-(a.leadPriority||0)).filter(a=>{const key=a.image.sourceUrl;if(photoSources.has(key))return false;photoSources.add(key);return true;});
    state.photosAvailable=photoCandidates.length;
    if(photoCandidates.length<5){state.photosMissing=5-photoCandidates.length;return {state};}
    const leadIds=photoCandidates.slice(0,5).map(a=>a.id),leadSet=new Set(leadIds);
    const editionArticles=articles.map(a=>{const copy={...a};if(!leadSet.has(a.id))delete copy.image;return copy;});
    editionArticles.push(...reserves);
    const fingerprint=crypto.createHash('sha256').update(JSON.stringify(editionArticles)).digest('hex').slice(0,12);
    // Derive the date's UTC offset from Europe/Rome; do not assume winter time.
    const offset=new Intl.DateTimeFormat('en',{timeZone:'Europe/Rome',timeZoneName:'longOffset'}).formatToParts(new Date(today+'T12:00:00Z')).find(x=>x.type==='timeZoneName').value.replace('GMT','');
    const edition={schemaVersion:1,id:today+'-batches-'+fingerprint,mode:'live',editionDate:today,
      generatedAt:new Date(now).toISOString(),timezone:'Europe/Rome',scheduledFor:today+'T07:30:00'+offset,
      essentialIds:leadIds,leadIds,compactIds:articles.filter(a=>!leadSet.has(a.id)).map(a=>a.id),articles:editionArticles,...(reserves.length?{reserveIds:reserves.map(a=>a.id)}:{})};
    validate(edition,true,true);state.ready=true;state.editionId=edition.id;return {state,edition};
  }catch(e){state.invalid.push({slug:'edition',reason:e.message});return {state};}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const today=romeDay(),root=process.argv[2]||'automation/editorial';const blocks={};
  for(const [slug] of categories){const file=path.join(root,today,slug+'.json');if(fs.existsSync(file)){try{blocks[slug]=JSON.parse(fs.readFileSync(file));}catch(e){blocks[slug]={schemaVersion:0,error:e.message};}}}
  const savedStateFile=path.join(root,'status.json');
  const previous=fs.existsSync(savedStateFile)?JSON.parse(fs.readFileSync(savedStateFile)):null;
  const result=assemble(blocks,today);fs.mkdirSync(root,{recursive:true});
  const current=fs.existsSync('dist/data/current.json')?JSON.parse(fs.readFileSync('dist/data/current.json')):null;
  result.state.needsPublication=!!result.edition&&current?.id!==result.edition.id;
  if(current?.id===result.state.editionId&&previous?.publicEditionId===current.id&&previous.publication==='verified'){
    Object.assign(result.state,{publicEditionId:previous.publicEditionId,publicVerifiedAt:previous.publicVerifiedAt,publication:'verified'});
  }
  fs.writeFileSync(path.join(root,'status.json'),JSON.stringify(result.state,null,2)+'\n');
  if(result.state.needsPublication){fs.mkdirSync('incoming',{recursive:true});fs.writeFileSync('incoming/edition.json',JSON.stringify(result.edition,null,2)+'\n');}
  if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'ready='+String(result.state.needsPublication)+'\ncomplete='+String(result.state.ready)+'\n');
  console.log(JSON.stringify(result.state));
}
