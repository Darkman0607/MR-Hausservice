const CACHE='mr-hausservice-v1-9-8-0';
const ASSETS=["./","./index.html","./work1964.css","./lager2.css","./lager_gallery19713.css","./premium1976.css","./premium1977.css","./dashboard1978.css","./dashboard1979.css","./private1980.css","./js/private1980.js","./kalender19712.css","./js/kalender19712.js","./js/dashboard1979.js","./js/dashboard1978.js","./js/lager_gallery19713.js","./js/lager2.js","./js/lager_doc_store19716.js","./js/lager_dokumente19716.js","./lager_dokumente19716.css","./lager_service19717.css","./js/inventory_metrics.js","./js/auftrag_layout1964.js","./manifest.webmanifest","./icon-192.png","./icon-512.png","./js/auftrag_typ1962.js","./js/auftrag_layout1963.js","./js/core.js","./js/verwaltung.js","./js/auftraege_medien.js","./js/backup_google.js","./js/kalender.js","./js/updates.js","./js/oberflaeche.js","./js/verbesserungen1961.js","./premium19714.css","./lager_delete19715.css","./js/icon_theme19714.js","./icons3d/box.png","./icons3d/cable.png","./icons3d/cleaning.png","./icons3d/drill.png","./icons3d/electronics.png","./icons3d/garden.png","./icons3d/gloves.png","./icons3d/paint.png","./icons3d/ui-calendar.svg","./icons3d/ui-camera.svg","./icons3d/ui-home.svg","./icons3d/ui-money.svg","./icons3d/ui-notification.svg","./icons3d/ui-profile.svg","./icons3d/ui-settings.svg","./icons3d/ui-stock.svg","./icons3d/ui-work.svg"];
const BUILD='19800';
const assetKey=path=>/\.(js|css)$/i.test(path)?path+'?build='+BUILD:path;
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const c=await caches.open(CACHE);
 // Fetch current files independently, never let a failed image prevent the release from installing.
 await Promise.all(ASSETS.map(async asset=>{const dest=assetKey(asset);try{const r=await fetch(new Request(dest,{cache:'reload'}));if(r.ok)await c.put(dest,r)}catch(err){}}));
 try{const r=await fetch(new Request('./index.html',{cache:'reload'}));if(r.ok)await c.put('./index.html',r)}catch(err){}
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('mr-hausservice-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();
})()));
const PDF_ROUTE=new URL('./__mrdoc/',self.registration.scope).pathname;
function localPdfResponse(req){
 return (async()=>{
  const url=new URL(req.url),path=url.pathname.substring(PDF_ROUTE.length),segments=path.split('/');
  if(segments.length!==2)return new Response('Ungültiger Dokumentpfad.',{status:400});
  let id,name;try{id=decodeURIComponent(segments[0]);name=decodeURIComponent(segments[1]);}catch(_){return new Response('Ungültiger Dateiname.',{status:400})}
  if(!/^[A-Za-z0-9_-]{4,100}$/.test(id)||!name.toLowerCase().endsWith('.pdf'))return new Response('Ungültiges PDF.',{status:400});
  try{
   const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('mr_hausservice_secure_v12');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
   if(!db.objectStoreNames.contains('attachments')){db.close();return new Response('Dokumentenspeicher nicht bereit.',{status:404})}
   const blob=await new Promise((resolve,reject)=>{const tx=db.transaction('attachments','readonly');const r=tx.objectStore('attachments').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});db.close();
   if(!(blob instanceof Blob)||blob.type!=='application/pdf')return new Response('PDF nicht gefunden.',{status:404});
   const safeName=name.replace(/[\r\n\\";]/g,'_').slice(0,180),encoded=encodeURIComponent(safeName);
   const headers=new Headers({'Content-Type':'application/pdf','Content-Disposition':`inline; filename*=UTF-8''${encoded}`,'Accept-Ranges':'bytes','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'});
   const range=req.headers.get('Range');let part=blob,status=200;
   if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${blob.size}`}});
     let from=m[1]?Number(m[1]):0,to=m[2]?Number(m[2]):blob.size-1;
     if(!m[1]&&m[2]){const suffix=Number(m[2]);from=Math.max(0,blob.size-suffix);to=blob.size-1}
     if(from>=blob.size||from>to||!Number.isSafeInteger(from)||!Number.isSafeInteger(to))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${blob.size}`}});
     to=Math.min(blob.size-1,to);part=blob.slice(from,to+1,'application/pdf');status=206;headers.set('Content-Range',`bytes ${from}-${to}/${blob.size}`);
   }
   headers.set('Content-Length',String(part.size));return new Response(req.method==='HEAD'?null:part,{status,headers});
  }catch(err){return new Response('Lokale PDF-Datei konnte nicht gelesen werden: '+String(err?.message||'Fehler'),{status:500})}
 })();
}
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if((req.method==='GET'||req.method==='HEAD')&&url.pathname.startsWith(PDF_ROUTE)){e.respondWith(localPdfResponse(req));return}
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
   e.respondWith(fetch(new Request(req,{cache:'no-store'})).catch(()=>caches.match('./index.html')));return;
 }
 if(/\.(js|css)$/i.test(url.pathname)||url.pathname.endsWith('/version.json')){
  e.respondWith((async()=>{
   try{const r=await fetch(new Request(req,{cache:'no-store'}));if(r.ok&&/\.(js|css)$/i.test(url.pathname)){const c=await caches.open(CACHE);await c.put(req,r.clone())}return r}
   catch(err){return (await caches.match(req))||(await caches.match(req,{ignoreSearch:true}))||Response.error()}
  })());return;
 }
 e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
