'use strict';
/* MR-Hausservice 1.9.7.16: binary files live in a separate IndexedDB store.
   Only metadata/references live in db.stock; exported JSON includes binary attachments. */
const MR_DOC_MAX_FILE=15*1024*1024;
const MR_DOC_TYPES={
  'application/pdf':['pdf'],
  'image/png':['png'],
  'image/jpeg':['jpg','jpeg'],
  'image/webp':['webp'],
  'text/plain':['txt']
};
function mrDocsList(stock=db.stock){return (stock||[]).flatMap(x=>Array.isArray(x.l2documents)?x.l2documents:[])}
function mrDocsFileIds(stock=db.stock){return [...new Set(mrDocsList(stock).filter(d=>d&&d.type==='file').map(d=>String(d.id)))];}
function mrDocsGet(id){return new Promise((resolve,reject)=>{
  if(!storage||!storage.objectStoreNames.contains('attachments'))return reject(Error('Dokumentenspeicher ist nicht verfügbar.'));
  const tx=storage.transaction('attachments','readonly');const req=tx.objectStore('attachments').get(String(id));
  req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error||Error('Datei konnte nicht geladen werden'));
});}
function mrDocsFileMime(file){const ext=String(file.name||'').split('.').pop().toLowerCase();return Object.keys(MR_DOC_TYPES).find(m=>MR_DOC_TYPES[m].includes(ext))||'';}
function mrDocsValidateFile(file){if(!file||!file.size)throw Error('Bitte eine nicht leere Datei auswählen.');if(file.size>MR_DOC_MAX_FILE)throw Error('Datei zu groß. Maximum: 15 MB pro Datei.');const mime=mrDocsFileMime(file);if(!mime||file.type&&file.type!==mime&&file.type!=='application/octet-stream'&&!(mime==='image/jpeg'&&file.type==='image/jpg'))throw Error('Erlaubt sind PDF, PNG, JPG, WEBP oder TXT.');return mime;}
async function mrDocsValidateContent(file,mime){const b=new Uint8Array(await file.slice(0,16).arrayBuffer());const prefix=[...b].map(c=>String.fromCharCode(c)).join('');
 if(mime==='application/pdf'&&!prefix.startsWith('%PDF-'))throw Error('Die ausgewählte Datei ist kein gültiges PDF.');
 if(mime==='image/png'&&!(b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71&&b[4]===13&&b[5]===10&&b[6]===26&&b[7]===10))throw Error('Ungültige PNG-Datei.');
 if(mime==='image/jpeg'&&!(b[0]===255&&b[1]===216&&b[2]===255))throw Error('Ungültige JPG-Datei.');
 if(mime==='image/webp'&&!(prefix.startsWith('RIFF')&&prefix.slice(8,12)==='WEBP'))throw Error('Ungültige WEBP-Datei.');
 if(mime==='text/plain'&&b.some(c=>c===0))throw Error('Ungültige Textdatei.');
}
function mrDocsDataUrl(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Datei konnte nicht für das Backup gelesen werden'));r.readAsDataURL(blob)});}
function mrDocsFromDataUrl(uri){if(typeof uri!=='string')throw Error('Dokument-Inhalt fehlt.');const match=/^data:(application\/pdf|image\/png|image\/jpeg|image\/webp|text\/plain);base64,([a-zA-Z0-9+/=]+)$/.exec(uri);
 if(!match)throw Error('Ungültiges oder unsicheres Dateiformat in Sicherung.');const str=atob(match[2]);if(str.length>MR_DOC_MAX_FILE)throw Error('Dokument in Sicherung zu groß.');const bytes=new Uint8Array(str.length);for(let i=0;i<str.length;i++)bytes[i]=str.charCodeAt(i);return new Blob([bytes],{type:match[1]});}
async function mrDocsBackup(stock=db.stock){const ids=mrDocsFileIds(stock),result=[];for(const id of ids){const blob=await mrDocsGet(id);if(!(blob instanceof Blob))throw Error('Dokument '+id+' ist nicht mehr lokal vorhanden. Backup abgebrochen, damit keine unvollständige Sicherung entsteht.');result.push({id,data:await mrDocsDataUrl(blob)})}return result}
function mrDocsAuditStock(stock,attachments){if(!Array.isArray(stock))throw Error('Lagerdaten ungültig');if(!Array.isArray(attachments))throw Error('Dokumentenanhänge ungültig');const found=new Map();for(const a of attachments){if(!a||typeof a.id!=='string'||typeof a.data!=='string'||found.has(a.id))throw Error('Doppelte oder fehlerhafte Dokumentdaten');found.set(a.id,a.data)}
 for(const d of mrDocsList(stock)){if(!d||typeof d.id!=='string'||!d.type||!['file','note','link','checklist'].includes(d.type))throw Error('Ungültiger Dokumenteintrag');if(d.type==='file'&&!found.has(d.id))throw Error('Dokument „'+String(d.title||d.id)+'“ fehlt in dieser Sicherung. Import abgebrochen.');}
 // Reject unrelated or unsafe file content too, including without corresponding metadata.
 for(const [id,data] of found){if(!mrDocsFileIds(stock).includes(id))throw Error('Sicherung enthält eine nicht zugeordnete Dokumentdatei');if(data.length>22*1024*1024)throw Error('Datei in Sicherung überschreitet die zulässige Größe.');mrDocsFromDataUrl(data)}
}
function mrDocsRemapForImport(stock,attachments){mrDocsAuditStock(stock,attachments);const map=new Map(attachments.map(a=>[a.id,a.data]));const files=[];for(const x of stock)for(const d of x.l2documents||[]){const prev=d.id;d.id=uid();if(d.type==='file')files.push({id:d.id,blob:mrDocsFromDataUrl(map.get(prev))})}return files}
function mrDocsCommitWithState(puts=[],deletes=[]){return new Promise((resolve,reject)=>{if(!storage) return reject(Error('Datenbank nicht verfügbar'));const tx=storage.transaction(['state','attachments'],'readwrite');const fileStore=tx.objectStore('attachments');for(const p of puts)fileStore.put(p.blob,String(p.id));for(const id of deletes)fileStore.delete(String(id));tx.objectStore('state').put(db,'main');tx.oncomplete=()=>{lastSaved=new Date().toLocaleString('de-AT');updateStorageStatus();resolve(true)};tx.onabort=()=>reject(tx.error||Error('Dokumentenspeicherung abgebrochen'));tx.onerror=()=>reject(tx.error||Error('Dokumentenspeicherung fehlgeschlagen'))})}
async function mrDocsPrepareBackup(){const pkg=makeBackupPackage();pkg.attachments=await mrDocsBackup(db.stock);pkg.womenVault=await mrWomenVaultSnapshot();backupAudit193(pkg);mrDocsAuditStock(pkg.data.stock,pkg.attachments);return pkg}
async function mrDocsRestorePack(pkg){backupAudit193(pkg);const data=pkg.data||pkg;const attachments=pkg.attachments||[];mrDocsAuditStock(data.stock,attachments);
 if(pkg.womenVault!==undefined && pkg.womenVault!==null)mrWomenCheckVault(pkg.womenVault);
 const puts=attachments.map(a=>({id:a.id,blob:mrDocsFromDataUrl(a.data)}));const previous=db;
 db={...data,work:data.work,photos:data.photos,stock:data.stock,projects:Array.isArray(data.projects)?data.projects:[],appointments:Array.isArray(data.appointments)?data.appointments:[],dayNotes:data.dayNotes||{}};
 let committed=false;try{await mrDocsCommitWithState(puts);committed=true;if(pkg.womenVault)await mrWomenVaultRestore(pkg.womenVault);return true}catch(e){if(!committed)db=previous;throw e}
}

// Clean up files whose articles were permanently deleted. Keep checkpoint-linked files.
async function mrDocsPruneOrphans(){if(!storage)return 0;const keep=new Set(mrDocsFileIds(db.stock));
 const point=await mr1961ReadCheckpoint();for(const id of mrDocsFileIds(point?.data?.stock||[]))keep.add(id);
 return await new Promise((resolve,reject)=>{const tx=storage.transaction('attachments','readwrite');const st=tx.objectStore('attachments');const request=st.getAllKeys();let count=0;
 request.onsuccess=()=>{for(const key of request.result){if(!keep.has(String(key))){st.delete(key);count++}}};request.onerror=()=>reject(request.error||Error('Dokumente konnten nicht geprüft werden'));
 tx.oncomplete=()=>resolve(count);tx.onerror=()=>reject(tx.error||Error('Bereinigung fehlgeschlagen'));
 });
}
