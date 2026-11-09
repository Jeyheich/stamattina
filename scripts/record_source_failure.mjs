import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cyclePath,writeJSON} from './editorial_cycles.mjs';
import {categories} from './assemble_batches.mjs';
export function recordFailure(state,edition,log){
  const failureLine=String(log).split('\n').find(line=>/^(?:Pubblicazione bloccata:|check_(?:article|photo):)/.test(line));
  const failedIds=new Set([...String(failureLine).matchAll(/check_(?:article|photo): ([a-z0-9-]+):/g)].map(match=>match[1]));
  const text=(failureLine||String(log)).slice(0,6000);
  const affected=new Set((edition?.articles||[]).filter(a=>failedIds.has(a.id)).map(a=>categories.find(([,name])=>name===a.category)?.[0]).filter(Boolean));
  const invalid=[...affected].map(slug=>({slug,reason:'Controllo fonte/foto fallito: consultare sourceErrors'}));
  if(!invalid.length)invalid.push({slug:'edition',reason:'Controllo completo fallito: consultare sourceErrors'});
  return {...state,ready:false,editorialComplete:false,needsPublication:false,blocked:true,sourceErrors:text,
    completed:(state.completed||[]).filter(slug=>!affected.has(slug)),invalid:[...(state.invalid||[]),...invalid]};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const file='automation/editorial/status.json';
  const state=JSON.parse(fs.readFileSync(file));
  const edition=JSON.parse(fs.readFileSync('incoming/edition.json'));
  const log=fs.readFileSync(process.argv[2],'utf8');
  const failed=recordFailure(state,edition,log);writeJSON(file,failed);if(state.collectionId)writeJSON(path.join(cyclePath('automation/editorial',state.collectionId),'status.json'),failed);
}
