const CACHE='mr-hausservice-v1-9-9-1';
const ASSETS=["./","./index.html","./work1964.css","./lager2.css","./lager_gallery19713.css","./premium1976.css","./premium1977.css","./dashboard1978.css","./dashboard1979.css","./private1980.css","./js/private1980.js","./kalender19712.css","./js/kalender19712.js","./js/dashboard1979.js","./js/dashboard1978.js","./js/lager_gallery19713.js","./js/lager2.js","./js/lager_doc_store19716.js","./js/lager_dokumente19716.js","./lager_dokumente19716.css","./lager_service19717.css","./js/inventory_metrics.js","./js/auftrag_layout1964.js","./manifest.webmanifest","./icon-192.png","./icon-512.png","./js/auftrag_typ1962.js","./js/auftrag_layout1963.js","./js/core.js","./js/verwaltung.js","./js/auftraege_medien.js","./js/backup_google.js","./js/kalender.js","./js/updates.js","./js/oberflaeche.js","./js/verbesserungen1961.js","./premium19714.css","./lager_delete19715.css","./js/icon_theme19714.js","./icons3d/box.png","./icons3d/cable.png","./icons3d/cleaning.png","./icons3d/drill.png","./icons3d/electronics.png","./icons3d/garden.png","./icons3d/gloves.png","./icons3d/paint.png","./icons3d/ui-calendar.svg","./icons3d/ui-camera.svg","./icons3d/ui-home.svg","./icons3d/ui-money.svg","./icons3d/ui-notification.svg","./icons3d/ui-profile.svg","./icons3d/ui-settings.svg","./icons3d/ui-stock.svg","./icons3d/ui-work.svg","./private1981.css","./variant2_1982.css","./js/variant2_1981.js","./js/women_vault1981.js","./icons3d/ui-heart.svg","./icons3d/ui-clean.svg","./icons3d/ui-school.svg","./icons3d/ui-car.svg","./icons3d/ui-folder.svg","./v2_assets/baby.svg","./v2_assets/bolt.svg","./v2_assets/book.svg","./v2_assets/box.svg","./v2_assets/briefcase.svg","./v2_assets/calendar.svg","./v2_assets/check.svg","./v2_assets/clock.svg","./v2_assets/cloud.svg","./v2_assets/cycle.svg","./v2_assets/drop.svg","./v2_assets/flower.svg","./v2_assets/group.svg","./v2_assets/home.svg","./v2_assets/house.webp","./v2_assets/more.svg","./v2_assets/notes.svg","./v2_assets/orders.svg","./v2_assets/people.svg","./v2_assets/plus.svg","./v2_assets/portrait.webp","./v2_assets/user.svg","./family_assets/household.webp","./family_assets/fridge.webp","./family_assets/shopping.webp","./family_assets/finance.webp","./family_assets/school.webp","./family_assets/reminder.webp","./family_assets/vehicle.webp","./family_assets/docs.webp","./family_assets/project.webp","./family_assets/notes.webp","./frauen-app/cervical-mucus-nfp.svg","./frauen-app/self_guides.js","./frauen-app/cervix-cycle-comparison.svg","./frauen-app/discharge-types.svg","./frauen-app/lessons.js","./frauen-app/speculum-types.svg","./frauen-app/app.js","./frauen-app/vaginal-palpation-technique.svg","./frauen-app/cycle-hormones-chart.svg","./frauen-app/anatomy-breast.svg","./frauen-app/icon.svg","./frauen-app/README.md","./frauen-app/speculum-application.svg","./frauen-app/speculum-prep-tray.svg","./frauen-app/index.html","./frauen-app/deep_lessons.js","./frauen-app/version.json","./frauen-app/period-hygiene-products.svg","./frauen-app/postpartum-fundus.svg","./frauen-app/style.css","./frauen-app/manifest.webmanifest","./frauen-app/speculum-period-view.svg","./frauen-app/anatomy-vulva.svg","./frauen-app/speculum-cleaning-aftercare.svg","./frauen-app/anatomy-cervix.svg","./frauen-app/mr-integration.css"];
const MR_1986_ASSETS=['./household1987.css','./release1986.css',...['household','fridge','shopping','finance','school','reminder','vehicle','docs','project','notes'].map(x=>'./family_assets/'+x+'.webp')];
for(const p of MR_1986_ASSETS){if(!ASSETS.includes(p))ASSETS.push(p)}
const MR_1988_ASSETS=['./household1988.css','./household1988_assets/tabs.webp','./household1988_assets/hero.webp','./household1988_assets/actions.webp'];
for(const p of MR_1988_ASSETS){if(!ASSETS.includes(p))ASSETS.push(p)}
if(!ASSETS.includes('./household1989.css'))ASSETS.push('./household1989.css');
for(const x of ['./women1990.css','./frauen-app/mr-integration.css'])if(!ASSETS.includes(x))ASSETS.push(x);
for(const x of ['./private1991.css','./js/private_finance1991.js'])if(!ASSETS.includes(x))ASSETS.push(x);
const BUILD='19910';
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
   e.respondWith(fetch(new Request(req,{cache:'no-store'})).catch(()=>url.pathname.includes('/frauen-app/')?caches.match('./frauen-app/index.html'):caches.match('./index.html')));return;
 }
 if(/\.(js|css)$/i.test(url.pathname)||url.pathname.endsWith('/version.json')){
  e.respondWith((async()=>{
   try{const r=await fetch(new Request(req,{cache:'no-store'}));if(r.ok&&/\.(js|css)$/i.test(url.pathname)){const c=await caches.open(CACHE);await c.put(req,r.clone())}return r}
   catch(err){return (await caches.match(req))||(await caches.match(req,{ignoreSearch:true}))||Response.error()}
  })());return;
 }
 e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
