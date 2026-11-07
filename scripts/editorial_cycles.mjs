import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
export const slugs=['politica','esteri','economia','cronaca','roma','cultura','tecnologia','sport'];
export function parseCycle(id){
 const m=/^(\d{4}-\d{2}-\d{2})-(mattina|pomeriggio)$/.exec(id||'');
 if(!m||new Date(m[1]+'T12:00:00Z').toISOString().slice(0,10)!==m[1])throw Error('collectionId non valido: '+id);
 return {day:m[1],slot:m[2]};
}
export function cyclePath(root,id){const {day,slot}=parseCycle(id);return path.join(root,day,slot);}
export function selectCycle({explicit,scheduledAt,now=new Date()}={}){
 if(explicit){parseCycle(explicit);return explicit;}
 const date=scheduledAt?new Date(scheduledAt):now;
 if(!Number.isFinite(date.getTime()))throw Error('Ora prevista non valida');
 const parts=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 return p.year+'-'+p.month+'-'+p.day+'-'+(Number(p.hour)<12?'mattina':'pomeriggio');
}
export function writeJSON(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const out=JSON.stringify(value,null,2)+'\n';if(fs.existsSync(file)&&fs.readFileSync(file,'utf8')===out)return;fs.writeFileSync(file+'.tmp',out);fs.renameSync(file+'.tmp',file);}
export function readBlocks(root,id){
 const blocks={};for(const slug of slugs){const file=path.join(cyclePath(root,id),slug+'.json');if(fs.existsSync(file)){try{blocks[slug]=JSON.parse(fs.readFileSync(file));}catch(e){blocks[slug]={error:e.message};}}}return blocks;
}
const hash=b=>crypto.createHash('sha256').update(JSON.stringify(b)).digest('hex');
export function ingestLegacy(root,day,{history=false}={}){
 const ledgerFile=path.join(root,day,'legacy-imports.json');
 const ledger=fs.existsSync(ledgerFile)?JSON.parse(fs.readFileSync(ledgerFile)): {};
 const errors=[];
 function ingest(b,slug,source,onlyMissing=false){
  let cycle;try{cycle=parseCycle(b.collectionId);if(cycle.day!==day||b.editionDate!==day)throw Error('Giorno discordante');}catch(e){errors.push({slug,reason:source+': '+e.message});return;}
  const target=path.join(cyclePath(root,b.collectionId),slug+'.json'),digest=hash(b);
  writeJSON(path.join(root,day,'checkpoints',cycle.slot,slug,digest+'.json'),b);
  if(onlyMissing){if(!fs.existsSync(target))writeJSON(target,b);return;}
  if(ledger[slug]===digest)return;
  if(fs.existsSync(target)){
   const old=JSON.parse(fs.readFileSync(target));
   const stamp=x=>Date.parse(x.lastAttemptAt||x.completedAt||'');
   if(hash(old)!==digest&&!(stamp(b)>stamp(old))){errors.push({slug,reason:'Conflitto checkpoint legacy/canonico: originali conservati, nessuna sovrascrittura'});return;}
  }
  writeJSON(target,b);ledger[slug]=digest;
 }
 if(history){
  // Preserve the last observed state of each cycle, including historical public proof.
  const stateLog=execFileSync('git',['log','--format=%H','HEAD','--',path.join(root,'status.json')],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  const restored=new Set();
  for(const sha of stateLog){
   try{
    const state=JSON.parse(execFileSync('git',['show',sha+':'+path.join(root,'status.json')],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));
    if(!state.collectionId||restored.has(state.collectionId)||parseCycle(state.collectionId).day!==day)continue;
    restored.add(state.collectionId);
    const file=path.join(cyclePath(root,state.collectionId),'status.json');
    if(!fs.existsSync(file))writeJSON(file,state);
   }catch{}
  }
  for(const slug of slugs){
   const file=path.join(root,day,slug+'.json');const seen=new Set();
   const commits=execFileSync('git',['log','--format=%H','HEAD','--',file],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
   for(const sha of commits){try{const b=JSON.parse(execFileSync('git',['show',sha+':'+file],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));if(seen.has(b.collectionId))continue;seen.add(b.collectionId);ingest(b,slug,sha,true);}catch{}}
  }
 }
 for(const slug of slugs){const file=path.join(root,day,slug+'.json');if(fs.existsSync(file)){try{ingest(JSON.parse(fs.readFileSync(file)),slug,file);}catch(e){errors.push({slug,reason:e.message});}}}
 writeJSON(ledgerFile,ledger);return errors;
}

// Explicit, single-cycle authorization to release the verified November 6 base.
export const november6BaseCycle = '2026-11-06-pomeriggio';
export const november6BaseCommit = 'Pubblica la base verificata del 6 novembre 2026';
