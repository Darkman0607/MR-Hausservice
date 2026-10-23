/* V1.9.8.4: Bewahrt Frauen-App-Datensätze im verschlüsselten Speicherformat auf. Bei passwortloser Nutzung ist der zur Wiederherstellung nötige Schlüssel in security enthalten! Backup-Dateien sind vertraulich. */
'use strict';
const MR_WOMEN_DB='frauen-app-beta';
function mrWomenOpenVault(){return new Promise((resolve,reject)=>{
 const r=indexedDB.open(MR_WOMEN_DB,2);r.onupgradeneeded=()=>{const db=r.result;for(const name of ['entries','photos','security'])if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Frauendatenbank konnte nicht geöffnet werden'));
 r.onblocked=()=>reject(Error('Frauen-App ist in einem anderen Tab geöffnet. Bitte andere Tabs schließen.'));
});}
function mrWomenTx(db,names,mode,callback){return new Promise((resolve,reject)=>{
 try{const tx=db.transaction(names,mode);const result=callback(tx);tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||Error('Datentransaktion abgebrochen'));tx.onerror=()=>reject(tx.error||Error('Datentransaktion fehlgeschlagen'))}catch(e){reject(e)}
});}
function mrWomenReadAll(db,table){return new Promise((resolve,reject)=>{
 try{const t=db.transaction(table,'readonly'),r=t.objectStore(table).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}catch(e){reject(e)}
});}
function mrWomenCheckEncryptedRow(row){return row&&typeof row.id==='string'&&row.id.length>0&&row.id.length<300&&row.secure===1&&typeof row.iv==='string'&&/^[A-Za-z0-9+/=]{12,50}$/.test(row.iv)&&typeof row.cipher==='string'&&row.cipher.length>=12&&/^[A-Za-z0-9+/=]+$/.test(row.cipher);}
function mrWomenCheckVault(v){
 if(!v||v.format!=='mr-frauen-vault' || v.version!==1||!Array.isArray(v.entries)||!Array.isArray(v.photos)||!v.security||v.entries.length>50000||v.photos.length>50000)throw Error('Ungültige Frauen-App Sicherung');
 const meta=v.security;if(meta.id!=='local'||typeof meta.salt!=='string'||!Number.isInteger(meta.iterations)||meta.iterations<100000||meta.iterations>1000000||!mrWomenCheckEncryptedRow(meta.check))throw Error('Ungültiger Frauen-App-Prüfwert');if(meta.mode==='auto-local-v2'&&(!/^[A-Za-z0-9+/]{42}[AEIMQUYcgkosw048]=$/.test(meta.autoKey||'')))throw Error('Automatischer Schlüssel in Frauen-App-Sicherung ungültig');
 for(const rows of [v.entries,v.photos]){const seen=new Set();for(const row of rows){if(!mrWomenCheckEncryptedRow(row)||seen.has(row.id))throw Error('Unverschlüsselter, beschädigter oder doppelter Frauendatensatz');seen.add(row.id)}}
 if(v.lessonProgress!==undefined){if(!v.lessonProgress||typeof v.lessonProgress!=='object'||Array.isArray(v.lessonProgress)||Object.keys(v.lessonProgress).length>1000||Object.keys(v.lessonProgress).some(k=>!/^frauen-app-lesson-done-\d{1,4}$/.test(k)||v.lessonProgress[k]!=='1'))throw Error('Ungültiger Lernfortschritt')}
 return true;
}
async function mrWomenVaultSnapshot(){
 const w=await mrWomenOpenVault();try{
 if(!['security','entries','photos'].every(s=>w.objectStoreNames.contains(s)))return null;
 const [sec,entries,photos]=await Promise.all([mrWomenReadAll(w,'security'),mrWomenReadAll(w,'entries'),mrWomenReadAll(w,'photos')]);
 const meta=sec.find(x=>x.id==='local');
 if(!meta){if(entries.length||photos.length)throw Error('Frauen-App enthält nicht verschlüsselte Altdaten. MR-Gesamtsicherung gestoppt – bitte zuerst die Frauen-App öffnen und sichern.');return null}
 const vault={format:'mr-frauen-vault',version:1,created:new Date().toISOString(),security:meta,entries,photos};mrWomenCheckVault(vault);return vault;
 }finally{w.close()}
}
async function mrWomenVaultRestore(vault){
 if(!vault)return false;mrWomenCheckVault(vault);
 const w=await mrWomenOpenVault();try{
 if(!['security','entries','photos'].every(s=>w.objectStoreNames.contains(s)))throw Error('Frauen-App zuerst einmal öffnen, damit die geschützte Datenbank angelegt wird. Danach wiederherstellen.');
 // Save a separate, local recovery checkpoint BEFORE replacing existing ciphertext.
 const previous=await mrWomenVaultSnapshot();
 if(previous&&typeof storage!=='undefined'&&storage){await new Promise((resolve,reject)=>{const tx=storage.transaction('state','readwrite');tx.objectStore('state').put({created:new Date().toISOString(),vault:previous},'women_pre_restore');tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||Error('Schutzpunkt für Frauen-App fehlgeschlagen'));tx.onerror=()=>reject(tx.error)})}
 await mrWomenTx(w,['security','entries','photos'],'readwrite',tx=>{
  for(const name of ['security','entries','photos'])tx.objectStore(name).clear();
  tx.objectStore('security').put(vault.security);
  for(const entry of vault.entries)tx.objectStore('entries').put(entry);
  for(const photo of vault.photos)tx.objectStore('photos').put(photo);
 });
 // Local lesson-completion flags are intentionally not included: they are outside the encrypted vault.
 // A loaded frame may still hold the old decryption key. Reload it to force password verification.
 const frame=document.getElementById('mrw-frame');if(frame?.hasAttribute('src'))frame.contentWindow.location.reload();
 return true;
 }finally{w.close()}
}
window.MR_WOMEN_VAULT_BUILD='1.9.8.4';
