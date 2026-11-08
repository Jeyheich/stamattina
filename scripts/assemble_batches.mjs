import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {validate} from './validate.mjs';
import {parseCycle,cyclePath,selectCycle,readBlocks,ingestLegacy,writeJSON,november6BaseCycle} from './editorial_cycles.mjs';

export const categories = [
  ['politica','Politica'],['esteri','Esteri'],['economia','Economia'],
  ['cronaca','Cronaca'],['roma','Roma'],['cultura','Cultura · Teatro · Cinema'],
  ['tecnologia','Tecnologia · AI'],['sport','Sport'],
];
export const romeDay = (date=new Date()) => new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome'}).format(date);
function recent(value,now,field){
  const t=Date.parse(value);
  assert(Number.isFinite(t),field+': data di verifica mancante o non valida');
  const times=()=>' (verifica '+new Date(t).toISOString()+', controllo '+new Date(now).toISOString()+')';
  if(t>now+300000)throw Error(field+': verifica futura'+times());
  if(now-t>10800000)throw Error(field+': verifica scaduta'+times());
}
export function validateBlock(block,slug,today,now=Date.now(),partial=false){
  const name=categories.find(([s])=>s===slug)?.[1];
  assert(name,'Categoria sconosciuta');assert.equal(block.schemaVersion,1);
  assert.equal(block.editionDate,today,'Blocco di un altro giorno');
  assert.equal(block.category,name,'Categoria del file errata');const blockStamp=partial?'lastAttemptAt':'completedAt';recent(block[blockStamp],now,blockStamp);
  assert(Array.isArray(block.articles)&&(partial?block.articles.length>=1&&block.articles.length<5:block.articles.length===5),'Il blocco completo deve contenere 5 notizie distinte');
  for(const a of block.articles){
    assert.equal(a.category,name);assert.equal(a.status,'verified');
    assert(typeof a.id==='string'&&/^[a-z0-9][a-z0-9-]{2,100}$/.test(a.id),'ID non valido');
    assert(typeof a.eventKey==='string'&&/^[a-z0-9][a-z0-9-]{5,160}$/.test(a.eventKey),'Manca eventKey del fatto');
    assert(a.title?.trim()&&a.summary?.trim(),'Titolo o sintesi mancanti');
    assert(Array.isArray(a.body)&&a.body.length&&a.body.every(p=>typeof p==='string'&&p.trim()),'Approfondimento mancante');
    assert(Number.isFinite(Date.parse(a.publishedAt)),'Data fonte mancante');
    if(a.dateKind!=='event')assert(Date.parse(a.publishedAt)<=now+300000,'Pubblicazione futura');
    recent(a.verifiedAt,now,a.id+' verifiedAt');recent(a.source?.accessCheckedAt,now,a.id+' source.accessCheckedAt');
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
export function assemble(blocks,today=romeDay(),now=Date.now(),requestedCycle){
  const state={editionDate:today,checkedAt:new Date(now).toISOString(),ready:false,editorialComplete:false,reserveMissing:categories.map(([slug])=>slug),completed:[],inProgress:[],missing:[],invalid:[],stories:[]};
  const articles=[],reserves=[];
  // A same-day refresh must not mix freshly reviewed blocks with the earlier edition.
  const cycles=[...new Set(Object.values(blocks).filter(b=>b.editionDate===today).map(b=>b.collectionId).filter(Boolean))];
  if(!requestedCycle&&cycles.length>1){state.invalid.push({slug:'edition',reason:'Cicli editoriali differenti'});return {state};}
  const cycle=requestedCycle||cycles[0];if(cycle){try{assert.equal(parseCycle(cycle).day,today);}catch(e){state.invalid.push({slug:'edition',reason:e.message});return {state};}state.collectionId=cycle;}
  for(const [slug,name] of categories){
    if(!blocks[slug]){state.missing.push(slug);continue;}
    if(cycle&&blocks[slug].collectionId!==cycle){state.missing.push(slug);state.invalid.push({slug,reason:'collectionId errato: atteso '+cycle});continue;}
    try{
      const partial=blocks[slug].status==='in-progress';validateBlock(blocks[slug],slug,today,now,partial);
      if(partial){state.inProgress.push({slug,count:blocks[slug].articles.length});state.stories.push(...blocks[slug].articles.map(({id,category,title,eventKey})=>({id,category,title,eventKey,pending:true})));}
      else{if(blocks[slug].reserveArticles!==undefined&&!(Array.isArray(blocks[slug].reserveArticles)&&blocks[slug].reserveArticles.length===0)){validateBlock({...blocks[slug],articles:blocks[slug].reserveArticles},slug,today,now);reserves.push(...blocks[slug].reserveArticles.map(a=>{const copy={...a};delete copy.image;delete copy.leadPriority;return copy;}));}state.completed.push(slug);articles.push(...blocks[slug].articles);}
    }
    catch(e){state.invalid.push({slug,reason:e.message});}
  }
  state.stories.push(...[...articles,...reserves].map(({id,category,title,eventKey})=>({id,category,title,eventKey})));
  state.reserveCounts=Object.fromEntries(categories.map(([,name])=>[name,reserves.filter(a=>a.category===name).length]));
  state.photoCandidates=articles.filter(a=>a.image).map(a=>({id:a.id,category:a.category,sourceUrl:a.image.sourceUrl}));
  state.photosAvailable=new Set(state.photoCandidates.map(a=>a.sourceUrl)).size;
  state.reserveMissing=categories.filter(([,name])=>state.reserveCounts[name]!==5).map(([slug])=>slug);
  state.categoryProgress=Object.fromEntries(categories.map(([slug,name])=>[slug,{base:state.inProgress.find(block=>block.slug===slug)?.count??articles.filter(a=>a.category===name).length,reserve:state.reserveCounts[name],draft:Array.isArray(blocks[slug]?.reserveDraft)?blocks[slug].reserveDraft.length:0,complete:state.completed.includes(slug)&&state.reserveCounts[name]===5}]));
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
    const fingerprint=crypto.createHash('sha256').update(JSON.stringify(cycle?{collectionId:cycle,articles:editionArticles}:editionArticles)).digest('hex').slice(0,12);
    // Derive the date's UTC offset from Europe/Rome; do not assume winter time.
    const offset=new Intl.DateTimeFormat('en',{timeZone:'Europe/Rome',timeZoneName:'longOffset'}).formatToParts(new Date(today+'T12:00:00Z')).find(x=>x.type==='timeZoneName').value.replace('GMT','');
    const edition={schemaVersion:1,...(cycle?{collectionId:cycle}:{}),id:today+'-batches-'+fingerprint,mode:'live',editionDate:today,
      generatedAt:new Date(now).toISOString(),timezone:'Europe/Rome',scheduledFor:today+(cycle?.endsWith('-pomeriggio')?'T19:00:00':'T09:00:00')+offset,
      essentialIds:leadIds,leadIds,compactIds:articles.filter(a=>!leadSet.has(a.id)).map(a=>a.id),articles:editionArticles,...(reserves.length?{reserveIds:reserves.map(a=>a.id)}:{})};
    validate(edition,true,true);state.ready=true;state.editorialComplete=state.reserveMissing.length===0;state.preparation=state.editorialComplete?'editorialmente-completa':'tecnicamente-pubblicabile';state.editionId=edition.id;return {state,edition};
  }catch(e){state.invalid.push({slug:'edition',reason:e.message});return {state};}
}
export function runAssembly({root='automation/editorial',cycle,now=Date.now(),history=false}={}){
 const selected=selectCycle({explicit:cycle,scheduledAt:process.env.EDITORIAL_SCHEDULED_AT,now:new Date(now)});
 const {day}=parseCycle(selected);
 const importErrors=ingestLegacy(root,day,{history});
 const file=path.join(cyclePath(root,selected),'status.json');
 const previous=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):null;
 const result=assemble(readBlocks(root,selected),day,now,selected);
 if(importErrors.length){result.state.invalid.push(...importErrors);result.state.ready=false;result.state.editorialComplete=false;delete result.edition;}
 if(!result.state.ready)result.state.preparation='in-preparazione';
 result.state.message=!result.state.ready?'Edizione in preparazione':result.state.editorialComplete?'Edizione editorialmente completa':'Edizione tecnicamente pubblicabile, aggiuntive incomplete: '+result.state.reserveMissing.join(', ');
 const current=fs.existsSync('dist/data/current.json')?JSON.parse(fs.readFileSync('dist/data/current.json')):null;
 const canAdvance=!current?.collectionId||selected>=current.collectionId;
 const today=romeDay(new Date(now));
 const recovery=process.env.EDITORIAL_RECOVERY==='true';
 const releaseBase=selected===november6BaseCycle&&process.env.EDITORIAL_RELEASE_NOV6_BASE==='true';
 const canPublishDate=day===today||day<today&&(recovery||releaseBase);
 const hasRequiredReserves=result.state.editorialComplete||releaseBase||day<'2026-11-07'&&day===today;
 result.state.needsPublication=!!result.edition&&current?.id!==result.edition.id&&canAdvance&&canPublishDate&&hasRequiredReserves;
 if(result.edition&&!canPublishDate)result.state.publicationBlocked='Ciclo arretrato: richiesto avvio esplicito';
 if(result.edition&&!hasRequiredReserves)result.state.publicationBlocked='Servono tutte le 40 aggiuntive';
 result.state.publicCollectionId=current?.collectionId;
 if(!canAdvance)result.state.publicationBlocked='Ciclo precedente a quello online';
 if(current?.id===result.state.editionId&&previous?.publicEditionId===current.id&&previous.publication==='verified'){
  Object.assign(result.state,{publicEditionId:previous.publicEditionId,publicVerifiedAt:previous.publicVerifiedAt,publication:'verified'});
 }
 writeJSON(file,result.state);writeJSON(path.join(root,'status.json'),result.state);
 if(result.state.needsPublication)writeJSON('incoming/edition.json',result.edition);
 if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'ready='+String(result.state.needsPublication)+'\ncomplete='+String(result.state.ready)+'\ncollectionId='+selected+'\n');
 return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log(JSON.stringify(runAssembly({root:process.argv[2]||'automation/editorial',cycle:process.env.EDITORIAL_COLLECTION_ID,history:process.argv.includes('--recover-history')}).state));
}
