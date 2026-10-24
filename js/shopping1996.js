/* MR-Hausservice V1.9.9.6 – Einkaufsmanager. Keine erfundenen Händlerpreise. */
(()=>{'use strict';
const STORES=['SPAR','Lidl','HOFER','Andere'];
const SHOP_URLS={SPAR:'https://www.spar.at/produktwelt',Lidl:'https://www.lidl.at/',HOFER:'https://www.hofer.at/produkte'};
const now=()=>new Date().toISOString();
const date=()=>now().slice(0,10);
const num=x=>{const n=Number(x);return Number.isFinite(n)?Math.round(n*100)/100:NaN};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>new Intl.NumberFormat('de-AT',{style:'currency',currency:'EUR'}).format(Number(x)||0);
const refKey=x=>x?.barcode&&/^\d{8,14}$/.test(String(x.barcode))?'ean:'+x.barcode:'text:'+String(x?.title||'').trim().toLocaleLowerCase('de-AT').replace(/\s+/g,' ')+'|'+String(x?.packSize||'').trim().toLocaleLowerCase('de-AT');
const storeOf=x=>STORES.includes(x?.store)?x.store:'Andere';
const market=x=>x?.store==='Alle'?'Andere':storeOf(x);
let ctx=null,filter='Alle',busyRefresh=false,refreshMessage='',nextAllowed=0;
function context(){if(!ctx)throw Error('Finanzmodul nicht geladen');return ctx}
function metadata(f){if(!f.shop1996||typeof f.shop1996!=='object')f.shop1996={};const m=f.shop1996;
if(!Array.isArray(m.prices))m.prices=[];if(!Array.isArray(m.history))m.history=[];if(!Array.isArray(m.pantry))m.pantry=[];
if(!m.feeds||typeof m.feeds!=='object')m.feeds={};
if(typeof m.autoRefresh!=='boolean')m.autoRefresh=true;
return m;}
function current(f,item,store){const key=refKey(item);return metadata(f).prices.filter(x=>x.key===key&&x.store===store&&Number.isFinite(+x.price)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0]||null}
function currencyPrice(f,item,store){const x=current(f,item,store);return x?money(x.price):'–'}
function distinct(f){const unique=new Map();for(const p of f.shopping){const k=refKey(p);if(!unique.has(k))unique.set(k,p);}return [...unique.values()];}
const totalFor=list=>list.reduce((a,x)=>a+(Number(x.expected)||0),0);
function linkFor(store,term){if(store==='SPAR')return 'https://www.spar.at/produktwelt/suche?query='+encodeURIComponent(term);
if(store==='HOFER')return 'https://www.hofer.at/produkte';return SHOP_URLS.Lidl;}
function row(f,item){const store=storeOf(item),q=Number(item.packCount)||1,p=current(f,item,store),price=p?money(p.price)+' / Packung':Number(item.expected)>0?money(Number(item.expected)/q)+' / Packung · Eigene Schätzung':'Preis offen';
const matches=STORES.slice(0,3).map(s=>current(f,item,s)).filter(Boolean);const cheapest=matches.length?matches.reduce((a,b)=>a.price<=b.price?a:b):null;
const unpriced=!p&&Number(item.expected)===0&&item.actual==null;const img=String(item.image||'');const displayImg=img&&(img.startsWith('data:image/')||/^https:\/\/(?:images\.openfoodfacts\.org|static\.openfoodfacts\.org)\//.test(img));
return `<div class="shop96-item" data-product="${esc(item.id)}">
 <label class="shop96-tick"><input type="checkbox" data-fin-check="${esc(item.id)}" ${item.checked?'checked':''} aria-label="${esc(item.title)} gekauft"/></label>
 ${displayImg?`<img loading="lazy" class="shop96-image" src="${esc(img)}" alt="Produktbild"/>`:'<span class="shop96-image shop96-noimage" aria-hidden="true">🛒</span>'}
 <div class="shop96-itembody"><b>${esc(item.title)}</b><small>${esc(item.packSize||item.qty||'')} · ${esc(store)}${item.barcode?' · EAN '+esc(item.barcode):''}</small>
 <span class="shop96-unit">${esc(price)} ${p?`<small>· ${esc(p.source==='feed'?'Preis-Feed':'selbst eingetragen')} ${esc(p.date||'')}</small>`:''}</span>
 ${cheapest?`<small class="shop96-tip">Günstigster bekannter Preis: ${esc(cheapest.store)} ${money(cheapest.price)} ${matches.length<2?'(kein vollständiger Vergleich)':''}</small>`:''}
 </div><div class="shop96-itemactions"><strong>${unpriced?'Preis offen':money(item.actual??item.expected)}</strong><button type="button" data-shop96="edit" data-id="${esc(item.id)}" title="Bearbeiten">✎</button><button type="button" data-shop96="prices" data-id="${esc(item.id)}" title="Preisvergleich">€</button><button type="button" data-shop96="lookup" data-id="${esc(item.id)}" title="Produktdaten anhand des Barcodes online laden" aria-label="Produktdaten anhand der EAN suchen">⌕</button><button type="button" data-fin="delete-shop" data-id="${esc(item.id)}" title="Entfernen">✕</button></div></div>`}
function render(f,header){const m=metadata(f),list=f.shopping.filter(x=>filter==='Alle'||storeOf(x)===filter),marked=f.shopping.filter(x=>x.checked&&(filter==='Alle'||storeOf(x)===filter));
const hasSource=STORES.slice(0,3).some(s=>m.feeds[s]);let msg=refreshMessage||m.lastStatus||'Keine Händler-Preisschnittstelle eingerichtet; manuell erfasste Preise bleiben verfügbar.';
return header('🛒','Einkauf & Preisvergleich','Einkaufslisten nach Geschäft, belegte Preise und Preisverlauf – auch offline.',`<button class="mr91-fin-primary" data-shop96="add" type="button">＋ Artikel</button>`)+
`<section class="shop96-dashboard"><div class="shop96-kicker">PREISE · SPAR / LIDL / HOFER</div><div class="shop96-controls"><button type="button" data-shop96="refresh" class="shop96-primary" ${busyRefresh?'disabled':''}>${busyRefresh?'⏳ Prüfe…':'↻ Preise aktualisieren'}</button><button type="button" data-shop96="sources">⚙ Preisquellen</button></div>
<label class="shop96-autocheck"><input type="checkbox" data-shop96-auto ${m.autoRefresh?'checked':''}/> Automatisch beim Öffnen prüfen</label>
<p class="shop96-status" role="status">${esc(msg)}</p><small>Eine automatische Abfrage funktioniert nur mit einem verbundenen, erreichbaren Preis-Feed. Es werden keine Händlerpreise geraten. Online-Produktdaten per Barcode stammen optional von Open Food Facts.</small>
<div class="shop96-shops">${['Alle',...STORES].map(s=>`<button type="button" data-shop96="store" data-store="${esc(s)}" class="${filter===s?'active':''}">${s==='Alle'?'🛒 Alle':s==='SPAR'?'🟩 SPAR':s==='Lidl'?'🟨 Lidl':s==='HOFER'?'🟧 HOFER':'🏪 Andere'}</button>`).join('')}</div>
<div class="shop96-totals"><div><small>Geplant</small><strong>${money(totalFor(list))}</strong></div><div><small>Im Wagen (${marked.length})</small><strong>${money(marked.reduce((a,x)=>a+Number(x.actual??x.expected??0),0))}</strong></div><div><small>Positionen</small><strong>${list.length}</strong></div></div></section>`+
`<section class="shop96-panel"><div class="shop96-heading"><h2>${filter==='Alle'?'Alle Einkaufslisten':esc(filter)+' · Einkaufsliste'}</h2><button data-shop96="add" type="button">＋ Artikel</button></div>
${list.length?list.map(x=>row(f,x)).join(''):'<div class="shop96-empty">Noch keine Artikel für dieses Geschäft. Tippe auf „Artikel“, um deine Einkaufsliste zu beginnen.</div>'}
<div class="shop96-checkout"><p>Nur abgehakte Artikel ${filter==='Alle'?'aller Geschäfte':'für '+esc(filter)} werden als private Ausgabe gebucht. Gespeicherte Preisvergleiche bleiben erhalten.</p><button type="button" class="shop96-primary" data-fin="checkout" ${marked.length?'':'disabled'}>✓ Einkauf buchen · ${money(marked.reduce((a,x)=>a+Number(x.actual??x.expected??0),0))}</button></div></section>`+
`<section class="shop96-panel"><div class="shop96-heading"><h2>🏷 Bekannte Marktpreise</h2><button type="button" data-shop96="history">↗ Preisverlauf</button></div>${distinct(f).slice(0,12).map(x=>`<div class="shop96-comparison"><b>${esc(x.title)} <small>${esc(x.packSize||'')}</small></b><div>${STORES.slice(0,3).map(s=>`<button type="button" data-shop96="setprice" data-product="${esc(x.id)}" data-store="${s}"><small>${s}</small><strong>${currencyPrice(f,x,s)}</strong></button>`).join('')}</div></div>`).join('')||'<p class="shop96-empty">Sobald du Artikel erfasst und Preise eingegeben hast, werden sie hier verglichen.</p>'}<p>Ein Vergleich ist nur bei identischem Barcode bzw. gleichem Produkt und gleicher Packungsgröße sinnvoll.</p></section>`+
`<section class="shop96-panel"><h2>Online nachsehen</h2><div class="shop96-links">${STORES.slice(0,3).map(s=>`<a target="_blank" rel="noopener noreferrer" href="${SHOP_URLS[s]}">${s} Produktseite ↗</a>`).join('')}</div><small>Die offiziellen Webseiten öffnen separat. Dort gesehene Preise kannst du anschließend in MR-Hausservice speichern.</small></section>`+
`<section class="shop96-panel"><h2>🥫 Vorratsliste</h2><p>Beim Buchen kannst du deine gekauften Lebensmittel optional in die private Vorratsliste übernehmen.</p>${m.pantry.length?m.pantry.slice(-8).reverse().map(x=>`<div class="shop96-pantry"><span>${esc(x.title)} · ${esc(x.qty||'')}</span><button type="button" data-shop96="pantry-delete" data-id="${esc(x.id)}">Entfernen</button></div>`).join(''):'<div class="shop96-empty">Noch keine Lebensmittel übernommen.</div>'}</section>`;
}
function modalHtml(title,body,onSave){context().modal(title,body,onSave);}
const input=(label,name,value='',type='text',extra='')=>context().field(label,name,value,type,extra);
function storeSelect(val){return context().choose('Geschäft','store',STORES,STORES.includes(val)?val:filter==='Alle'?'SPAR':filter);}
function productForm(item){const f=context().state(),old=item||{},rid=old.id;
const body=input('Produktname *','title',old.title||'','text','required maxlength="100"')+storeSelect(old.store)+input('Barcode / EAN (optional)','barcode',old.barcode||'','text','inputmode="numeric" pattern="[0-9]{0,14}"')+input('Marke','brand',old.brand||'')+input('Packungsgröße (z. B. 1 Liter)','packSize',old.packSize||'')+input('Anzahl der Packungen','packCount',old.packCount||Number.parseFloat(String(old.qty||''))||1,'number','required min="0.001" step="0.001"')+input('Geplanter Gesamtpreis (€)','expected',old.expected??'','number','required min="0" step="0.01"')+input('Tatsächlicher Gesamtpreis (€; optional)','actual',old.actual??'','number','min="0" step="0.01"')+input('Eigenes Produktfoto (optional)','imageFile','','file','accept="image/*"')+`<p class="shop96-formhint">Falls der Preis unbekannt ist, zunächst 0 eingeben (Preis offen). Bei eingetragener EAN kannst du danach Name und Produktbild aus Open Food Facts nachschlagen. Laden von Bildern ist freiwillig.</p>`;
modalHtml(rid?'Einkaufsartikel bearbeiten':'Einkaufsartikel hinzufügen',body,async fd=>{
const title=String(fd.get('title')||'').trim(),bc=String(fd.get('barcode')||'').trim(),count=Number(fd.get('packCount')),expected=num(fd.get('expected')),raw=String(fd.get('actual')||'').trim(),actual=raw===''?null:num(raw);
if(!title||bc&&!/^\d{8,14}$/.test(bc)||!Number.isFinite(count)||count<=0||count>100000||!Number.isFinite(expected)||expected<0||!Number.isFinite(actual??0)||actual!==null&&actual<0){alert('Bitte Produkt, Menge, Barcode und Preise kontrollieren.');return false;}
let img=old.image||'';const file=fd.get('imageFile');if(file instanceof File&&file.size>0){try{img=await photo(file)}catch(e){alert('Foto: '+e.message);return false}}
const obj={...old,id:rid||context().id(),title,store:String(fd.get('store')),barcode:bc,brand:String(fd.get('brand')||''),packSize:String(fd.get('packSize')||'').trim(),packCount:count,qty:count+' × '+(String(fd.get('packSize')||'Packung').trim()),expected,actual,image:img,checked:!!old.checked};
return context().commit(f=>{const ix=f.shopping.findIndex(x=>x.id===obj.id);if(ix>=0)f.shopping[ix]=obj;else f.shopping.push(obj)});
});}
async function photo(file){if(file.size>12_000_000)throw Error('Bild darf maximal 12 MB groß sein.');const url=URL.createObjectURL(file);try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});const canvas=document.createElement('canvas');const factor=Math.min(1,500/Math.max(img.width,img.height));canvas.width=Math.max(1,Math.round(img.width*factor));canvas.height=Math.max(1,Math.round(img.height*factor));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',0.68)}finally{URL.revokeObjectURL(url)}}
function existingById(id){return context().state().shopping.find(x=>x.id===id)}
function addKnownPrice(item,store){if(!item)return;const f=context().state(),last=current(f,item,store);
modalHtml(`${store} · Preis erfassen`,input('Produkt','readonlyTitle',item.title,'text','readonly')+input('Preis pro Packung (€)','price',last?.price??'','number','required min="0" step="0.01"')+input('Datum','checkedAt',date(),'date','required')+input('Quelle / Beleg (optional)','sourceNote',last?.sourceNote||'')+`<p class="shop96-formhint">Nur den selbst überprüften Preis eintragen. Alte Preise bleiben im Verlauf erhalten.</p>`,async fd=>{
const price=num(fd.get('price')),checkedAt=String(fd.get('checkedAt'));if(!Number.isFinite(price)||price<0||!/^\d{4}-\d\d-\d\d$/.test(checkedAt))return false;
return context().commit(f=>record(f,item,store,price,checkedAt,'manuell',String(fd.get('sourceNote')||'')));
});}
function record(f,item,store,price,checkedAt,source,note=''){
const m=metadata(f),key=refKey(item),row={id:context().id(),key,store,price:num(price),date:checkedAt,source,sourceNote:note,updatedAt:now()};if(!Number.isFinite(row.price)||row.price<0)return;
m.prices=m.prices.filter(x=>!(x.key===key&&x.store===store));m.prices.push(row);
m.history.push(row);if(m.history.length>1200)m.history.splice(0,m.history.length-1200);
for(const p of f.shopping){if(refKey(p)===key&&storeOf(p)===store&&!p.checked){p.expected=num(row.price*(Number(p.packCount)||1));p.priceUpdated=row.date;}}
}
function priceCompare(item){if(!item)return;const f=context().state(),m=metadata(f),key=refKey(item);const entries=m.history.filter(x=>x.key===key).slice(-25).reverse();
modalHtml('Preisvergleich · '+item.title,`<div class="shop96-modal-price">${STORES.slice(0,3).map(s=>{const p=current(f,item,s);return `<div><b>${s}</b> <span>${p?money(p.price):'Unbekannt'}</span><small>${esc(p?.date||'Noch kein Preis')} · ${esc(p?.source==='feed'?'Preis-Feed':'manuell')}</small></div>`}).join('')}</div><p class="shop96-formhint">Bestätigte Preise können je Markt, Aktionszeitpunkt und Packungsgröße abweichen.</p>${entries.length?entries.map(x=>`<p class="shop96-hrow">${esc(x.date)} · ${esc(x.store)} · ${money(x.price)} · ${esc(x.source==='feed'?'Preis-Feed':'eigene Eingabe')}</p>`).join(''):'<p>Kein Preisverlauf vorhanden.</p>'}`,async()=>true);
}
function historyDialog(){const entries=metadata(context().state()).history.slice(-80).reverse();modalHtml('Preisverlauf',entries.map(x=>`<p class="shop96-hrow">${esc(x.date)} · ${esc(x.store)} · ${money(x.price)} · ${esc(x.key)} (${esc(x.source)})</p>`).join('')||'<p>Keine gespeicherten Preise.</p>',async()=>true)}
function sourceConfig(){const m=metadata(context().state());modalHtml('Preisquellen verbinden',`<p>Optionale HTTPS-JSON-Feeds mit erlaubtem CORS-Zugriff. Ohne Feed gibt es keine automatischen Live-Händlerpreise.</p>${STORES.slice(0,3).map(s=>input(`${s} – HTTPS-Feed (optional)`,'feed'+s,m.feeds[s]||'','url','placeholder="https://.../preise.json"')).join('')}<p class="shop96-formhint">JSON-Format: [{"barcode":"...","name":"...","packSize":"1 l","price":1.99,"date":"2026-10-24"}]. Der Feed muss öffentlich erreichbar sein, CORS erlauben und zulässig bereitgestellt werden. Keine fremden Zugangsdaten hier eintragen.</p>`,async fd=>{
const next={};for(const s of STORES.slice(0,3)){const url=String(fd.get('feed'+s)||'').trim();if(url){let u;try{u=new URL(url)}catch(e){alert('Ungültige Feed-Adresse');return false}if(u.protocol!=='https:'||u.username||u.password){alert('Nur HTTPS ohne Zugangsdaten.');return false}}next[s]=url;}
return context().commit(f=>{metadata(f).feeds=next;metadata(f).lastStatus='Preisquellen gespeichert. Starte „Preise aktualisieren“. '});
})}
async function fetchOpenFood(item){if(!/^\d{8,14}$/.test(String(item?.barcode||''))){alert('Bitte zuerst den Barcode beim Artikel erfassen.');return}
if(!navigator.onLine){alert('Keine Internetverbindung für die Produktdaten.');return}
const url='https://world.openfoodfacts.org/api/v2/product/'+encodeURIComponent(item.barcode)+'.json?fields=code,product_name,product_name_de,brands,quantity,image_front_small_url';
try{const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),9000);let res;try{res=await fetch(url,{signal:ctl.signal})}finally{clearTimeout(timeout)}if(!res.ok)throw Error('HTTP '+res.status);
const j=await res.json();if(j.status!==1||!j.product)throw Error('Produkt nicht gefunden');const p=j.product,title=p.product_name_de||p.product_name||item.title,img=String(p.image_front_small_url||'');if(!confirm('Open Food Facts meldet: '+title+' ('+(p.quantity||'Größe unbekannt')+'). Stammdaten übernehmen?'))return;
const ok=await context().commit(f=>{const x=f.shopping.find(a=>a.id===item.id);if(!x)return;x.brand=p.brands||x.brand;x.title=title;x.packSize=p.quantity||x.packSize;if(/^https:\/\/images\.openfoodfacts\.org\//.test(img))x.image=img;});if(ok)refreshMessage='Produktdetails geladen (Open Food Facts). Händlerpreise sind damit nicht bestätigt.';
}catch(e){refreshMessage='Produktdaten nicht geladen: '+(e?.message||'Netzwerkfehler');context().paint();}}
function validFeedItem(x){if(!x||typeof x!=='object')return null;const code=String(x.barcode||'').replace(/\s/g,''),name=String(x.name||x.title||'').trim(),packSize=String(x.packSize||'').trim(),price=num(x.price),day=String(x.date||date());if(code&&!/^\d{8,14}$/.test(code)||!name&&!code||!Number.isFinite(price)||price<0||price>100000||!/^\d{4}-\d\d-\d\d$/.test(day))return null;return {barcode:code,title:name,packSize,price,date:day}}
async function refresh(force){if(busyRefresh||!context())return;const f=context().state(),m=metadata(f);if(!force&&Date.now()<nextAllowed)return;if(!force&&m.lastRefresh&&Date.now()-Date.parse(m.lastRefresh)<30*60*1000)return;
const sources=STORES.slice(0,3).filter(s=>m.feeds[s]);nextAllowed=Date.now()+30*60*1000;
if(!sources.length){refreshMessage='Keine automatische Händler-Preisquelle verbunden. Letzte bekannte Preise bleiben bestehen. SPAR/Lidl/HOFER über die offiziellen Seiten prüfen oder unter ⚙ einen autorisierten Feed verbinden.';context().paint();return}
if(!navigator.onLine){refreshMessage='Offline: gespeicherte Preise bleiben verfügbar.';context().paint();return}
busyRefresh=true;refreshMessage='Preis-Feeds werden abgerufen…';context().paint();let count=0,errors=[];const staged=[];
try{for(const s of sources){try{const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),10000);let r;try{r=await fetch(m.feeds[s],{signal:ctl.signal,cache:'no-store',mode:'cors'})}finally{clearTimeout(timeout)}if(!r.ok)throw Error('HTTP '+r.status);
const max=Number(r.headers.get('content-length')||0);if(max>1_500_000)throw Error('Feed zu groß');const t=await r.text();if(t.length>1_500_000)throw Error('Feed zu groß');const json=JSON.parse(t),arr=Array.isArray(json)?json:json.products;if(!Array.isArray(arr))throw Error('Ungültiges Format');for(const raw of arr.slice(0,5000)){const q=validFeedItem(raw);if(q)staged.push({...q,store:s})}
}catch(err){errors.push(s+': '+(err?.message||'nicht erreichbar'))}}
if(staged.length){await context().commit(f=>{for(const q of staged){const item=f.shopping.find(x=>refKey(x)===refKey(q)||q.barcode&&String(x.barcode||'')===q.barcode);if(item){record(f,item,q.store,q.price,q.date,'feed');count++}}metadata(f).lastRefresh=now()});}
else{await context().commit(f=>{metadata(f).lastRefresh=now()})}
refreshMessage=`Aktualisierung beendet: ${count} zugeordnete Händlerpreise`+(errors.length?' · Fehler: '+errors.join('; '):'')+'. Nicht gefundene Preise wurden nicht geändert.';
}catch(err){refreshMessage='Preis-Update fehlgeschlagen: '+(err.message||err)}finally{busyRefresh=false;context().paint()}
}
function connect(api){ctx=api}
function open(){const m=metadata(context().state());if(m.autoRefresh)refresh(false).catch(console.error)}
function selected(f){return f.shopping.filter(x=>x.checked&&(filter==='Alle'||storeOf(x)===filter))}
function onCheckout(f,bought,enabled){if(!enabled)return;const m=metadata(f);for(const item of bought){m.pantry.push({id:context().id(),title:item.title,barcode:item.barcode||'',qty:item.qty||'',store:item.store||'',addedAt:date()})}}
function checkoutSetup(selected){const f=context().state();const m=metadata(f);const label='<label class="shop96-pantryopt"><input type="checkbox" name="toPantry" value="yes"/> Gekaufte Artikel auch in meine Vorratsliste übernehmen</label>';
return label;}
function actions(e){const b=e.target.closest('[data-shop96]');if(!b)return;e.preventDefault();const type=b.dataset.shop96,item=existingById(b.dataset.id||b.dataset.product);switch(type){
case'store':filter=b.dataset.store;context().paint();return;
case'add':productForm(null);return;
case'edit':productForm(item);return;
case'prices':priceCompare(item);return;
case'setprice':addKnownPrice(item,b.dataset.store);return;
case'refresh':refresh(true).catch(e=>{refreshMessage='Fehler: '+e.message;context().paint()});return;
case'sources':sourceConfig();return;
case'history':historyDialog();return;
case'lookup':fetchOpenFood(item);return;
case'pantry-delete':if(confirm('Aus Vorratsliste entfernen?'))context().commit(f=>{metadata(f).pantry=metadata(f).pantry.filter(x=>x.id!==b.dataset.id)});return;}}
document.addEventListener('click',actions);
document.addEventListener('change',e=>{if(e.target.matches('[data-shop96-auto]'))context().commit(f=>{metadata(f).autoRefresh=e.target.checked})});
window.MR_SHOP1996={connect,render,open,selected,onCheckout,checkoutSetup,edit:productForm,metadata,refKey,record,validFeedItem,refresh,sourceConfig};
})();
