import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseCycle,selectCycle,november6BaseCycle,november6BaseCommit} from './editorial_cycles.mjs';
const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));
const releaseBase=process.env.GITHUB_EVENT_NAME==='push' && event.head_commit?.message===november6BaseCommit;
let selected=releaseBase?november6BaseCycle:event.inputs?.collectionId;
const recovery=process.env.GITHUB_EVENT_NAME==='workflow_dispatch' && event.inputs?.recoverOlderEdition==='true';
if(recovery&&!selected)throw Error('Selezionare il ciclo da recuperare');
if(!selected&&process.env.GITHUB_EVENT_NAME==='push'){
 const before=event.before,sha=process.env.GITHUB_SHA;
 const files=execFileSync('git',['diff','--name-only',before,sha,'--','automation/editorial'],{encoding:'utf8'}).trim().split('\n');
 const cycles=new Set();
 for(const file of files){
  if(!/^automation\/editorial\/\d{4}-\d{2}-\d{2}\/(?:mattina\/|pomeriggio\/)?(?:politica|esteri|economia|cronaca|roma|cultura|tecnologia|sport)\.json$/.test(file))continue;
  try{const block=JSON.parse(execFileSync('git',['show',sha+':'+file],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));parseCycle(block.collectionId);cycles.add(block.collectionId);}catch(e){throw Error('Blocco modificato non valido: '+file+': '+e.message);}
 }
 if(cycles.size>1)throw Error('Push con piu cicli: usare un ciclo esplicito');
 selected=[...cycles][0];
}
selected=selectCycle({explicit:selected,scheduledAt:event.head_commit?.timestamp});
fs.appendFileSync(process.env.GITHUB_ENV,'EDITORIAL_COLLECTION_ID='+selected+'\nEDITORIAL_RECOVERY='+recovery+'\nEDITORIAL_RELEASE_NOV6_BASE='+releaseBase+'\n');
console.log('Ciclo selezionato dal contenuto dell evento, indipendente dal ritardo: '+selected);
