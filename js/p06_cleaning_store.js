/* P06 – Putzlager: filtered view of existing stock, cloth circulation, inventory, purchase and room kits.
   No automatic migration, no invented quantities, no duplicated stock. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.MRP06Store=api})(typeof globalThis!=='undefined'?globalThis:null,function(){'use strict';
const ROUND=n=>Math.round((Number(n)+Number.EPSILON)*1e6)/1e6;
const num=v=>v===null||v===undefined||String(v).trim()===''?NaN:Number(v);
// Restrictive by default: neither 'Privat', nor 'Geräte', nor incidental household storage is cleaning equipment.
const clean=/(reinig|putz|spül|seife|handschuh|nitril|latex|vinyl|schwamm|wisch|eimer|bürste|mopp|mop|besen|tuch|lappen|mikrofaser|glasrein|wc-rein|geschirr|staubsaug|entkalk|desinfek|staubwedel|scheuer)/i;
const exclude=/verlängerungskabel|kabel|\busb\b|steckdose|powerbank|ladegerät|handy|elektronik|garten|bohrer|motor|motorsäge|hammer|schrauber|maler|akku|ladestation|netzkabel|arbeitshandschuh|schweißhandschuh/i;
const categoryAllow=/reinigungsmittel|putzmittel|haushaltsreinigung|putzzubehör|reinigungszubehör|hygiene|geschirrtücher|putztücher/i;
const scope=x=>x?.l2home===true||(x?.scope||'Privat')!=='Arbeit'?'Privat':'Gewerbe';
const washKinds=['Geschirrtücher','Putztücher'];
function eligible(item){if(item?.p06Include===true)return true;if(item?.p06Include===false)return false;
 const title=String(item?.title||''),cat=String(item?.category||''),sub=String(item?.l2sub||'');
 // Exclude obvious non-cleaning objects even if someone put them under the wrong category.
 if(exclude.test(title+' '+sub))return false;
 // A broad category such as 'Geräte', 'Zuhause' or 'Privat' is NEVER an inclusion rule.
 return categoryAllow.test(cat)||clean.test(title+' '+sub);
}
function group(db,h,p04,kind='Privat'){
 const out=new Map();for(const x of p04.entries(db,h,kind)){
  if(!eligible(x.source))continue;
  const id=x.kind==='stock'?'stock:'+x.id:'legacy:'+x.id;
  const old=out.get(id)||{id,kind:x.kind,source:x.source,title:x.title,unit:x.unit,scope:x.scope,qty:0,unknown:false,locations:[],minimum:x.minimum||0};
  if(!Number.isFinite(x.qty))old.unknown=true;else old.qty=ROUND(old.qty+x.qty);
  old.locations.push(x);out.set(id,old);
 }
 for(const x of db.stock||[]){if(scope(x)!==kind||x.l2kind!=='geraet'||!eligible(x))continue;const id='device:'+x.id;const loc=(x.locations||[]).map(l=>({key:p04.mainId(String(x.id),l.place),kind:'stock',id:String(x.id),title:x.title,unit:x.unit||'Stück',qty:num(l.quantity),minimum:0,scope:kind,source:x,location:l}));out.set(id,{id,kind:'device',source:x,title:x.title,unit:x.unit||'Stück',scope:kind,qty:loc.reduce((a,v)=>a+(Number.isFinite(v.qty)?v.qty:0),0),unknown:loc.some(v=>!Number.isFinite(v.qty)),locations:loc,minimum:0});}
 return [...out.values()].sort((a,b)=>a.title.localeCompare(b.title,'de'));
}
function low(item){return !item.unknown&&item.kind!=='device'&&item.minimum>0&&item.qty<=item.minimum}
function category(item,h){if(item.kind==='device')return 'Geräte';const t=(item.title+' '+(item.source.category||'')).toLowerCase();if(washKinds.includes(h?.p06Cloths?.[item.id]?.type)||/geschirrtuch|putztuch|tücher|tuch\b/i.test(t))return 'Tücher';if(/handschuh|nitril|latex/i.test(t))return 'Handschuhe';if(/eimer|wisch|bürste|besen|mopp|schwamm/i.test(t))return 'Geräte';return 'Putzmittel';}
function cloth(h,item,type){if(!washKinds.includes(type))throw Error('Nur Geschirrtücher oder Putztücher.');if(item.kind==='device'||!['Stück','Stk'].includes(item.unit))throw Error('Tücher benötigen einen Stückbestand im Hauptlager.');if(item.unknown||!Number.isInteger(item.qty))throw Error('Tücherbestand muss eine bekannte ganze Stückzahl sein.');h.p06Cloths||={};const rec=h.p06Cloths[item.id]||(h.p06Cloths[item.id]={type,dirty:0,events:[]});rec.type=type;if(rec.dirty>item.qty)throw Error('Mehr Tücher in Wäsche als im Hauptlager. Zuerst Inventur korrigieren.');return rec;}
function counts(item,record){const dirty=record?.dirty||0;if(!Number.isInteger(dirty)||dirty<0||dirty>item.qty)throw Error('Tücherbestand stimmt nicht mit Wäschebestand überein.');return{total:item.qty,dirty,clean:item.qty-dirty}}
function moveCloths(h,item,action,amount,all=false,at=new Date().toISOString()){
 const rec=h.p06Cloths?.[item.id];if(!rec)throw Error('Tücher zuerst zuordnen.');const c=counts(item,rec),limit=action==='dirty'?c.clean:c.dirty;
 const q=all?limit:num(amount);if(!Number.isInteger(q)||q<=0||q>limit)throw Error('Ungültige Tücherzahl oder zu wenig saubere/schmutzige Tücher.');
 rec.dirty+=action==='dirty'?q:-q;rec.events.push({at,action,qty:q,clean:item.qty-rec.dirty,dirty:rec.dirty});return counts(item,rec);
}
function ensure(h){h.p06Shopping||=[];h.p06Events||=[];h.p06Purchases||=[];h.p06Kits||={};h.p06Cloths||={};h.p06Device||={};return h}
function find(db,h,p04,id,kind='Privat'){const r=group(db,h,p04,kind).find(x=>x.id===id);if(!r)throw Error('Artikel nicht gefunden oder nicht für das Putzlager freigegeben.');return r}
function applyCount(db,h,p04,item,key,newAmount,reason,at=new Date().toISOString()){
 if(item.kind==='device')throw Error('Geräte sind kein Verbrauchsmaterial.');if(!String(reason||'').trim())throw Error('Begründung fehlt.');const raw=num(newAmount);if(!Number.isFinite(raw)||raw<0)throw Error('Bitte einen nicht-negativen Zahlenwert eingeben.');
 const row=p04.row(db,h,key);if(row.scope!=='Privat')throw Error('Privat/Gewerbe nicht vermischen.');if(row.kind==='stock'&&!eligible(row.source))throw Error('Artikel gehört nicht zum Putzlager.');
 const qty=p04.convert(raw,row.unit,row.unit);const prev=row.qty;if(!Number.isFinite(prev))throw Error('Unbekannter Hauptlagerbestand. Bitte dort zunächst den Bestand erfassen.');
 if(h.p06Cloths?.[item.id]&&qty+item.qty-prev<h.p06Cloths[item.id].dirty)throw Error('Inventur unterhalb der bereits zur Wäsche gebuchten Tücher.');
 p04.stockRow(db,h,key);const evt=p04.apply? p04.apply(db,h,key,ROUND(qty-prev)):(()=>{if(row.location)row.location.quantity=qty;else row.source.qty=qty;return{before:prev,after:qty}})();
 ensure(h).p06Events.push({kind:'inventory',at,key,title:item.title,from:prev,to:qty,reason:String(reason).trim()});return evt;
}
function manualUse(db,h,p04,key,qty,unit,roomId,ref,at=new Date().toISOString()){
 ensure(h);if(!ref)throw Error('Referenz fehlt.');if(h.p06Events.some(x=>x.kind==='manual'&&x.ref===ref))throw Error('Verbrauch bereits verbucht.');const row=p04.row(db,h,key),item=find(db,h,p04,row.kind==='stock'?'stock:'+row.id:'legacy:'+row.id);if(item.kind==='device'||h.p06Cloths?.[item.id])throw Error('Wiederverwendbare Tücher/Geräte dürfen nicht verbraucht werden.');
 const records=p04.book(db,h,[{id:key,qty,unit:unit||row.unit,roomId}],ref,at);h.p06Events.push({kind:'manual',ref,at,title:row.title,key,qty,unit:unit||row.unit,roomId:roomId||'',txId:records[0]?.txId});return records;
}
function purchase(db,h,p04,key,qty,unit,price,shop,scopeName='Privat',at=new Date().toISOString(),receipt=''){
 ensure(h);const row=p04.row(db,h,key);if(row.scope!==scopeName)throw Error('Einkauf muss dem richtigen Lagerbereich zugeordnet werden.');const n=num(qty),euros=num(price);if(!Number.isFinite(n)||n<=0||!Number.isFinite(euros)||euros<0)throw Error('Menge und Preis ungültig.');const delta=p04.convert(n,unit||row.unit,row.unit);
 if(!Number.isFinite(row.qty))throw Error('Bestand fehlt – bitte zuerst den Artikel vervollständigen.');
 if(row.location)row.location.quantity=ROUND(row.qty+delta);else row.source.qty=ROUND(row.qty+delta);
 const rec={id:'p06-buy-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),at,date:at.slice(0,10),key,title:row.title,scope:scopeName,qty:delta,unit:row.unit,price:euros,shop:String(shop||'').slice(0,100),receipt,financePosted:false};h.p06Purchases.push(rec);h.p06Events.push({kind:'purchase',at,key,title:row.title,qty:delta,unit:row.unit,price:euros});return rec;
}
function prepare(db,h,p04,roomId){ensure(h);const items=h.p06Kits[roomId]||[];return items.map(x=>{let item;try{item=find(db,h,p04,x.itemId)}catch(_){return{...x,missing:true,title:'Gelöschter/nicht freigegebener Artikel'}}const q=num(x.qty);const unit=x.unit||item.unit;const available=item.kind==='device' ?item.qty:item.unknown?NaN:item.qty;
 let need=q;try{need=p04.convert(q,unit,item.unit)}catch(_){need=NaN}
 const record=h.p06Cloths[item.id];const ready=record?counts(item,record).clean:available;
 return {...x,title:item.title,ready,unit:item.unit,missing:!Number.isFinite(need)||!Number.isFinite(ready)||need>ready||h.p06Device[item.id]==='defekt'||h.p06Device[item.id]==='wartung',need};});}
function packView(item,size,p04){const x=num(size);if(!Number.isFinite(x)||x<=0)return null;if(item.unknown)return null;let ml;try{ml=p04.convert(item.qty,item.unit,'ml')}catch(_){return null}const full=Math.floor(ml/x),open=ROUND(ml-full*x);return{full,open,total:ml,packMl:x,estimated:true};}
const gloveMaterials=['Nitril','Latex','Vinyl','Andere'],gloveColors=['Weiß','Blau','Pink','Schwarz','Andere'];
function gloveRows(db){return (db.stock||[]).filter(x=>scope(x)==='Privat'&&/handschuh|nitril|latex|vinyl/i.test(x.title||'')&&eligible(x));}
function gloveOption(item){const title=(item.title||'').toLowerCase();const material=gloveMaterials.find(m=>m!=='Andere'&&title.includes(m.toLowerCase()))||'Andere';const color=gloveColors.find(c=>c!=='Andere'&&title.includes(c.toLowerCase()))||'Andere';return{material,color};}
// Pair-based glove intake: explicit targetId is mandatory for additions to existing articles.
// A suggested match in the UI is never silently merged without user's submission.
function addGloves(db,h,{targetId='',material,color,pairs,place='Zuhause',newTitle='',at=new Date().toISOString(),makeId}={}){
 if(!gloveMaterials.includes(material)||!gloveColors.includes(color))throw Error('Material und Farbe auswählen.');
 const count=num(pairs);if(!Number.isSafeInteger(count)||count<=0||count>1000000)throw Error('Bitte eine ganze Anzahl Paare eingeben.');
 place=String(place||'').trim();if(!place||place.length>100)throw Error('Bitte Lagerort angeben.');
 let article,created=false,add=count,oldQty=0;
 if(targetId){article=(db.stock||[]).find(x=>String(x.id)===String(targetId)&&scope(x)==='Privat');if(!article||!/handschuh|nitril|latex|vinyl/i.test(article.title||''))throw Error('Vorhandenen Handschuhartikel auswählen.');
  if(article.unit==='Stück'||article.unit==='Stk')add=count*2;else if(article.unit!=='Paar')throw Error('Handschuhe müssen in Paar oder Stück gezählt werden.');
  if(article.p06Include===false)throw Error('Artikel ist vom Putzlager ausgeschlossen.');
 }else{
  const title=String(newTitle || (material==='Andere'?'Handschuhe':material+'-Handschuhe')+' '+(color==='Andere'?'':color)).trim().replace(/\s+/g,' ').slice(0,110);
  if(!title)throw Error('Artikelbezeichnung fehlt.');
  const normalized=t=>String(t||'').trim().toLocaleLowerCase('de');
  if((db.stock||[]).some(x=>scope(x)==='Privat'&&normalized(x.title)===normalized(title)))throw Error('Artikelname bereits vorhanden. Bitte bestehenden Artikel auswählen.');
  const uid=makeId||(()=>`p07-glove-${Date.now()}-${Math.random().toString(36).slice(2,10)}`);
  article={id:uid(),title,category:'Reinigungszubehör',unit:'Paar',scope:'Privat',l2home:true,l2shared:false,l2kind:'verbrauch',l2sub:'Handschuhe',images:[],note:'Schnellerfassung Putzlager',p06Include:true,p07GloveMaterial:material,p07GloveColor:color,createdAt:at,locations:[]};
  if(!Array.isArray(db.stock))db.stock=[];db.stock.push(article);created=true;
 }
 if(!Array.isArray(article.locations))article.locations=[];
 let loc=article.locations.find(l=>l.place===place);if(!loc){loc={place,quantity:0};article.locations.push(loc)}
 const previous=num(loc.quantity);if(!Number.isFinite(previous)||previous<0)throw Error('Vorhandene Menge unbekannt. Bitte zuerst Hauptlager korrigieren.');
 oldQty=previous;loc.quantity=ROUND(previous+add);
 if(!Number.isSafeInteger(loc.quantity))throw Error('Mengenüberlauf.');
 ensure(h).p06Events.push({kind:'gloves',at,articleId:article.id,title:article.title,material,color,place,unit:article.unit,added:add,pairs:count,from:oldQty,to:loc.quantity,created});
 return {id:article.id,created,addedPairs:count,unit:article.unit,newQty:loc.quantity};
}
return {num,scope,eligible,group,low,category,washKinds,cloth,counts,moveCloths,ensure,find,applyCount,manualUse,purchase,prepare,packView,gloveMaterials,gloveColors,gloveRows,gloveOption,addGloves};
});
