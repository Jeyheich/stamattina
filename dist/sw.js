const CACHE='stamattina-v13';
const base=new URL('./',self.location).pathname;
const shell=['','index.html','style.css?v=12','app.js?v=13','data/current.json','manifest.webmanifest','assets/icon.svg','assets/icon-192.png','assets/icon-512.png'];
const allowed=origin=>[self.location.origin,'https://upload.wikimedia.org','https://thumb.wikimedia.org'].includes(origin);
async function cachePhotos(response,cache){
  const edition=await response.json();
  await Promise.allSettled((edition.articles||[]).filter(a=>a.image).map(async a=>{
    const url=new URL(a.image.src,self.location.origin+base);
    if(!allowed(url.origin)||url.protocol!=='https:')return;
    const r=await fetch(url,{mode:'cors',credentials:'omit'});
    if(r.ok)await cache.put(url,r);
  }));
}
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(shell.map(x=>new Request(base+x,{cache:'reload'})));
  await cachePhotos((await cache.match(base+'data/current.json')).clone(),cache);
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('stamattina-')&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
])));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);if(!allowed(url.origin))return;
  let photoTask=Promise.resolve();
  const result=(async()=>{
    const cache=await caches.open(CACHE);
    try{
      const r=await fetch(e.request,url.origin===self.location.origin?{cache:'no-store'}:{});
      if(r.ok){
        await cache.put(e.request,r.clone());
        if(url.origin===self.location.origin&&url.pathname===base+'data/current.json')photoTask=cachePhotos(r.clone(),cache);
      }
      return r;
    }catch{
      const old=await cache.match(e.request);
      if(old){
        if(url.pathname===base+'data/current.json'){
          const headers=new Headers(old.headers);headers.set('X-Stamattina-Cache','offline');
          return new Response(old.body,{status:old.status,headers});
        }
        return old;
      }
      if(e.request.mode==='navigate')return await cache.match(base+'index.html');
      return new Response('Offline',{status:503});
    }
  })();
  e.respondWith(result);
  e.waitUntil(result.then(()=>photoTask).catch(()=>{}));
});
