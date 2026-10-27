import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {categories} from './assemble_batches.mjs';
export function recordFailure(state,edition,log){
  const text=String(log).slice(-6000);
  const affected=new Set((edition?.articles||[]).filter(a=>text.includes(a.id)).map(a=>categories.find(([,name])=>name===a.category)?.[0]).filter(Boolean));
  const invalid=[...affected].map(slug=>({slug,reason:'Controllo fonte/foto fallito: consultare sourceErrors'}));
  if(!invalid.length)invalid.push({slug:'edition',reason:'Controllo completo fallito: consultare sourceErrors'});
  return {...state,ready:false,needsPublication:false,blocked:true,sourceErrors:text,
    completed:(state.completed||[]).filter(slug=>!affected.has(slug)),invalid:[...(state.invalid||[]),...invalid]};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const file='automation/editorial/status.json';
  const state=JSON.parse(fs.readFileSync(file));
  const edition=JSON.parse(fs.readFileSync('incoming/edition.json'));
  const log=fs.readFileSync(process.argv[2],'utf8');
  fs.writeFileSync(file,JSON.stringify(recordFailure(state,edition,log),null,2)+'\n');
}
