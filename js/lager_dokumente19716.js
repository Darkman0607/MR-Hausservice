'use strict';
/* Article-specific manuals, images, PDF, notes, links, checklists. */
(()=>{
const escDoc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types={file:'📎 Datei',note:'📝 Notiz',link:'🔗 Link',checklist:'☑ Checkliste'};
const categories=['Bedienungsanleitung','Wartung & Pflege','Reparatur / Ersatzteile','Sicherheitsdatenblatt','Anleitung / Infoblatt','Sonstiges'];
const state={articleId:null,page:'list',selected:null,busy:false,previewUrl:null,previewBlob:null,previewBlobId:null};
let overlay;
const article=()=>db.stock.find(x=>String(x.id)===String(state.articleId));
const docs=()=>Array.isArray(article()?.l2documents)?article().l2documents:[];
const selected=()=>docs().find(d=>d.id===state.selected);
function closePreview(){if(state.previewUrl){URL.revokeObjectURL(state.previewUrl);state.previewUrl=null}state.previewBlob=null;state.previewBlobId=null}
function close(){closePreview();state.articleId=null;state.page='list';state.selected=null;if(overlay)overlay.hidden=true;if(typeof render==='function')render()}
function notify(msg,err=false){const el=overlay?.querySelector('#mrdoc-notice');if(el){el.textContent=msg;el.classList.toggle('error',err)}else if(err)alert(msg)}
function textRow(label,value){return value?`<div class="mrdoc-description"><strong>${escDoc(label)}:</strong> ${escDoc(value)}</div>`:''}
function btn(label,action,klass=''){return `<button type="button" class="mrdoc-btn ${klass}" data-mrdoc="${action}">${label}</button>`}
function docName(d){return escDoc(d.title||d.filename||'Ohne Titel')}
function sizeStr(bytes){return bytes>1024*1024?(bytes/1024/1024).toFixed(2)+' MB':Math.ceil((bytes||0)/1024)+' KB'}
function renderList(){const list=docs().slice().sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt)));
 return `<div class="mrdoc-help">Hier sammelst du Bedienungsanleitungen, Service- und Reparaturinformationen, eigene Notizen und Checklisten. Auch für Reinigungsmittel und private Artikel.</div>
 <div class="mrdoc-toolbar">${btn('＋ Neues Dokument','new','main')}<span>${list.length} Einträge</span></div>
 ${list.length?list.map(d=>`<button type="button" data-mrdoc="view:${escDoc(d.id)}" class="mrdoc-item"><span class="mrdoc-symbol">${({file:'📄',note:'📝',link:'🔗',checklist:'☑'})[d.type]||'📚'}</span><span class="mrdoc-item-main"><strong>${docName(d)}</strong><small>${escDoc(d.category||'Sonstiges')} · ${escDoc(types[d.type]||'Eintrag')}${d.type==='file'?' · '+sizeStr(d.size):''}</small></span><span>›</span></button>`).join(''):'<div class="mrdoc-empty">Noch keine Anleitungen zu diesem Artikel. Über „Neues Dokument“ kannst du die erste hinzufügen.</div>'}
 <p class="mrdoc-footnote">Dokumentdateien werden lokal in der App gespeichert. Vollständige JSON- und Google-Drive-Sicherungen enthalten sie mit.</p>`}
function form(d){const type=d?.type||'file';return `<form id="mrdoc-form" class="mrdoc-form"><label>Art des Eintrags<select name="type" id="mrdoc-type" ${d?'disabled':''}>
 ${Object.entries(types).map(([value,title])=>`<option value="${value}" ${value===type?'selected':''}>${title}</option>`).join('')}</select></label>
 <label>Titel *<input name="title" required maxlength="140" value="${escDoc(d?.title||'')}" placeholder="z. B. Messer wechseln"></label>
 <label>Thema<select name="category">${categories.map(c=>`<option ${c===(d?.category||categories[0])?'selected':''}>${escDoc(c)}</option>`).join('')}</select></label>
 <label>Quelle / Hersteller (optional)<input name="source" maxlength="220" placeholder="z. B. Originalanleitung vom Hersteller" value="${escDoc(d?.source||'')}"></label>
 <label>Modell / Gerätebezeichnung (optional)<input name="model" maxlength="140" placeholder="z. B. genaue Modellnummer" value="${escDoc(d?.model||'')}"></label>
 <label>Beschreibung (optional)<textarea name="description" maxlength="3500" rows="2" placeholder="Wichtige Hinweise oder Anmerkungen">${escDoc(d?.description||'')}</textarea></label>
 <div class="mrdoc-type-fields mrdoc-file" ${type!=='file'?'hidden':''}><label>${d?'Datei bleibt unverändert':'Datei auswählen *'}<input id="mrdoc-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/png,image/jpeg,image/webp,text/plain" ${d?'disabled':''}></label><small>PDF, PNG, JPG, WEBP oder TXT · max. 15 MB je Datei. ${d?'Zum Ersetzen zuerst eine neue Datei hinzufügen.':'Die Datei wird dauerhaft lokal gespeichert.'}</small></div>
 <div class="mrdoc-type-fields mrdoc-note" ${type!=='note'?'hidden':''}><label>Notiztext<textarea name="content" rows="7" placeholder="Schritte, Material, Werkzeug, Hinweise …">${escDoc(d?.content||'')}</textarea></label></div>
 <div class="mrdoc-type-fields mrdoc-link" ${type!=='link'?'hidden':''}><label>Webadresse (https://)<input name="url" type="url" inputmode="url" placeholder="https://www.hersteller.at/anleitungen" value="${escDoc(d?.url||'')}"></label></div>
 <div class="mrdoc-type-fields mrdoc-checklist" ${type!=='checklist'?'hidden':''}><label>Checkliste (eine Aufgabe pro Zeile)<textarea name="items" rows="7" placeholder="Motor ausschalten\nSchutzhandschuhe anziehen\nWerkzeug bereitlegen">${escDoc((d?.items||[]).map(i=>i.text).join('\n'))}</textarea></label><small>Erledigte Häkchen bleiben beim Bearbeiten gleichlautender Schritte erhalten.</small></div>
 <div class="mrdoc-toolbar"><button class="mrdoc-btn main" type="submit">✓ Speichern</button>${btn('Abbrechen',d?'view:'+escDoc(d.id):'list')}</div></form>`}
function renderView(d){return `<div class="mrdoc-panel"><div class="mrdoc-category">${escDoc(d.category||'Sonstiges')} · ${escDoc(types[d.type]||'Eintrag')}</div><h3>${docName(d)}</h3>
 ${textRow('Quelle',d.source)}${textRow('Modell',d.model)}${d.description?`<p class="mrdoc-description">${escDoc(d.description)}</p>`:''}
 ${d.type==='file'?`<div class="mrdoc-fileinfo">📎 ${escDoc(d.filename||'Datei')} · ${sizeStr(d.size)}</div><div class="mrdoc-toolbar">${btn('📖 Öffnen / Ansehen','fileOpen:'+escDoc(d.id),'main')}${btn('⬇ Herunterladen','fileDownload:'+escDoc(d.id))}</div>`:''}
 ${d.type==='note'?`<div class="mrdoc-text">${escDoc(d.content||'Keine Notiz vorhanden.')}</div>`:''}
 ${d.type==='link'?`${textRow('Adresse',d.url)}<div class="mrdoc-toolbar">${btn('↗ Webseite öffnen','linkOpen:'+escDoc(d.id),'main')}</div>`:''}
 ${d.type==='checklist'?`<div class="mrdoc-checks">${(d.items||[]).map((it,i)=>`<label><input type="checkbox" data-mrdoc-check="${i}" ${it.done?'checked':''}><span>${escDoc(it.text)}</span></label>`).join('')||'<p>Keine Aufgaben vorhanden.</p>'}</div>`:''}
 <small class="mrdoc-date">Angelegt: ${new Date(d.createdAt||Date.now()).toLocaleDateString('de-AT')}</small>
 </div><div class="mrdoc-toolbar">${btn('✎ Bearbeiten','edit:'+escDoc(d.id))}${btn('🗑 Löschen','delete:'+escDoc(d.id),'danger')}${btn('← Zurück','list')}</div>`}
function draw(){if(!article()){close();return}if(!overlay){overlay=document.createElement('div');overlay.className='mrdoc-overlay';overlay.id='mrdoc-overlay';overlay.hidden=true;document.body.appendChild(overlay);overlay.addEventListener('click',handleClick);overlay.addEventListener('change',handleChange);overlay.addEventListener('submit',handleSubmit);}
 overlay.hidden=false;const x=article(), d=selected();const crumb=state.page==='list'?'Dokumente':state.page==='new'?'Neuer Eintrag':state.page==='edit'?'Eintrag bearbeiten':'Eintrag ansehen';
 overlay.innerHTML=`<div class="mrdoc-dialog" role="dialog" aria-modal="true" aria-label="Anleitungen und Wissen"><header class="mrdoc-head"><div><h2>📚 Anleitungen &amp; Wissen</h2><small>${escDoc(x.title)} · ${escDoc(crumb)}</small></div>${btn('✕','close','close')}</header><div id="mrdoc-notice" class="mrdoc-notice" role="status" aria-live="polite"></div><div class="mrdoc-body">${state.page==='list'?renderList():state.page==='new'?form(null):state.page==='edit'&&d?form(d):state.page==='view'&&d?renderView(d):renderList()}</div></div>`;
}
function open(id){if(!db.stock.some(x=>String(x.id)===String(id)))return;state.articleId=id;state.selected=null;state.page='list';draw()}
function toggleType(){const type=overlay?.querySelector('#mrdoc-type')?.value;for(const t of Object.keys(types)){const field=overlay?.querySelector('.mrdoc-'+t);if(field)field.hidden=type!==t}}
async function handleSubmit(e){if(e.target.id!=='mrdoc-form')return;e.preventDefault();if(state.busy)return;const x=article();if(!x)return;const edit=state.page==='edit'?selected():null;const fd=new FormData(e.target),type=edit?.type||String(fd.get('type')||'file'),title=String(fd.get('title')||'').trim();if(!title){notify('Bitte Titel eingeben.',true);return}const now=new Date().toISOString();const id=edit?.id||uid();const record={...(edit||{}),id,type,title,category:String(fd.get('category')||'Sonstiges'),source:String(fd.get('source')||'').trim(),model:String(fd.get('model')||'').trim(),description:String(fd.get('description')||'').trim(),createdAt:edit?.createdAt||now,updatedAt:now};const file=fd.get('file');let puts=[];
 try{
 if(type==='file'&&!edit){const mime=mrDocsValidateFile(file);await mrDocsValidateContent(file,mime);record.filename=file.name;record.mime=mime;record.size=file.size;puts=[{id,blob:new Blob([file],{type:mime})}];}
 if(type==='note')record.content=String(fd.get('content')||'').trim();
 if(type==='link'){const url=String(fd.get('url')||'').trim();const u=new URL(url);if(u.protocol!=='https:')throw Error('Nur sichere https://-Links sind erlaubt.');record.url=u.href;}
 if(type==='checklist'){const oldByText=new Map((edit?.items||[]).map(it=>[it.text,it.done]));record.items=String(fd.get('items')||'').split(/\r?\n/).map(t=>t.trim()).filter(Boolean).slice(0,150).map(text=>({text,done:!!oldByText.get(text)}));}
 if(!edit&&docs().length>=100)throw Error('Maximal 100 Wissenseinträge je Artikel.');
 state.busy=true;const before=structuredClone(x.l2documents||[]);x.l2documents=x.l2documents||[];if(edit){const ix=x.l2documents.findIndex(d=>d.id===edit.id);if(ix<0)throw Error('Dokument nicht gefunden');x.l2documents[ix]=record;}else x.l2documents.push(record);
 try{if(puts.length)await mrDocsCommitWithState(puts);else if(!await save())throw Error('Speichern fehlgeschlagen.');}catch(err){x.l2documents=before;throw err}
 state.selected=id;state.page='view';draw();notify('✓ Eintrag gespeichert');
 }catch(err){notify('Speichern fehlgeschlagen: '+err.message,true)}finally{state.busy=false}
}
async function handleChange(e){if(e.target.id==='mrdoc-type')return toggleType();const index=e.target.dataset?.mrdocCheck;if(index===undefined)return;const d=selected();if(!d||d.type!=='checklist')return;const old=!!d.items[Number(index)]?.done;d.items[Number(index)].done=!!e.target.checked;d.updatedAt=new Date().toISOString();if(!await save()){d.items[Number(index)].done=old;e.target.checked=old;notify('Checkliste konnte nicht gespeichert werden',true)}}
function downloadBlob(blob,name){const link=document.createElement('a');const url=URL.createObjectURL(blob);link.href=url;link.download=name||'Dokument';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function pdfUrl(id,filename){
 // SW serves a named PDF file from IndexedDB on the same GitHub Pages origin.
 // This avoids Android's UUID-labelled blob: iframe PDF placeholder.
 return new URL('./__mrdoc/'+encodeURIComponent(String(id))+'/'+encodeURIComponent(filename||'Dokument.pdf'),location.href).href;
}
function inlinePDF(id){
 const d=docs().find(x=>x.id===id&&x.type==='file'&&x.mime==='application/pdf');if(!d)return;
 const body=overlay?.querySelector('.mrdoc-body');if(!body)return;
 const previous=body.querySelector('.mrdoc-preview-pdf');if(previous){previous.remove();return}
 const preview=document.createElement('iframe');preview.className='mrdoc-preview-pdf';preview.title=d.filename||'PDF-Dokument';preview.src=pdfUrl(id,d.filename);
 body.appendChild(preview);
 notify('Vorschau geöffnet. Falls dein Android-Browser weiterhin nur ein PDF-Symbol zeigt, verwende „PDF im Browser öffnen“ oder die PDF-App.');
}
function openBrowserPDF(id){
 const d=docs().find(x=>x.id===id&&x.type==='file'&&x.mime==='application/pdf');if(!d)return;
 const link=document.createElement('a');link.href=pdfUrl(id,d.filename);link.target='_blank';link.rel='noopener noreferrer';document.body.append(link);link.click();link.remove();
 notify('PDF-Aufruf gestartet. Zeigt dein Browser die Datei nicht an, wähle „Mit PDF-App öffnen“ oder „Herunterladen“.');
}
function sharePDF(id){
 const d=docs().find(x=>x.id===id&&x.type==='file'&&x.mime==='application/pdf');if(!d)return;
 // No IndexedDB await before navigator.share(): Android requires transient user activation.
 const blob=state.previewBlobId===id?state.previewBlob:null;
 if(!(blob instanceof Blob)){notify('PDF zunächst über „Öffnen / Ansehen“ laden.',true);return}
 const file=new File([blob],d.filename||'Dokument.pdf',{type:'application/pdf'});
 if(typeof navigator.share!=='function'||(navigator.canShare&&!navigator.canShare({files:[file]}))){
   downloadBlob(blob,d.filename||'Dokument.pdf');notify('Direktes Öffnen wird von diesem Browser nicht unterstützt. PDF gespeichert – öffne sie in „Dateien“ mit einer PDF-App.');return;
 }
 // Call synchronously inside the click, and deal with completion without blocking the click handler.
 try{navigator.share({files:[file],title:d.title||'PDF-Dokument'}).catch(error=>{
  if(error?.name==='AbortError')return;
  notify('PDF konnte nicht übergeben werden: '+String(error?.message||'Fehler')+'. Alternativ „Herunterladen“ wählen.',true);
 });}catch(error){notify('PDF konnte nicht übergeben werden: '+error.message+'. Alternativ „Herunterladen“ wählen.',true)}
}
async function openFile(id,download){
 const d=docs().find(x=>x.id===id);if(!d||d.type!=='file')return;
 try{
  const blob=await mrDocsGet(id);if(!(blob instanceof Blob))throw Error('Datei nicht gefunden. Prüfe die Sicherung.');
  if(download){downloadBlob(blob,d.filename);return}
  closePreview();const body=overlay.querySelector('.mrdoc-body');if(!body)return;
  const fileName=escDoc(d.filename||'Dokument');
  if(d.mime==='application/pdf'){
   state.previewBlob=blob;state.previewBlobId=id;
   const android=/Android/i.test(navigator.userAgent);
   const swInfo=(!('serviceWorker' in navigator)||!navigator.serviceWorker.controller)?'<p class="mrdoc-help">Hinweis: PDF im Browser benötigt eine aktive App-Verbindung. „Mit PDF-App öffnen“ oder „Herunterladen“ funktioniert unabhängig davon.</p>':'';
   const extra=android?'':`<iframe class="mrdoc-preview-pdf" title="${fileName}" src="${escDoc(pdfUrl(id,d.filename))}"></iframe>`;
   const btns=android
    ?`${btn('📤 Mit PDF-App öffnen','pdfShare:'+escDoc(id),'main')}${btn('⬇ PDF herunterladen','fileDownload:'+escDoc(id))}${btn('📖 Im Browser versuchen','pdfBrowser:'+escDoc(id))}`
    :`${btn('📖 PDF im Browser öffnen','pdfBrowser:'+escDoc(id),'main')}${btn('📤 Mit PDF-App öffnen','pdfShare:'+escDoc(id))}${btn('⬇ Herunterladen','fileDownload:'+escDoc(id))}`;
   body.innerHTML=`<div class="mrdoc-toolbar">${btn('← Zurück','view:'+escDoc(id))}</div><h3>${fileName}</h3><p class="mrdoc-help">Die PDF ist im Lager gespeichert. Auf Android „Mit PDF-App öffnen“ wählen und eine geeignete App auswählen. Falls das nicht angeboten wird: herunterladen und über „Dateien“ öffnen.</p><div class="mrdoc-toolbar mrdoc-pdf-buttons">${btns}</div>${swInfo}${extra}`;
   return;
  }
  state.previewUrl=URL.createObjectURL(blob);const url=escDoc(state.previewUrl);
  body.innerHTML=`<div class="mrdoc-toolbar">${btn('← Zurück','view:'+escDoc(id))}${btn('⬇ Herunterladen','fileDownload:'+escDoc(id))}</div><h3>${fileName}</h3>${d.mime.startsWith('image/')?`<img class="mrdoc-preview-img" src="${url}" alt="${fileName}">`:'<pre class="mrdoc-preview-text"></pre>'}`;
  if(d.mime==='text/plain')body.querySelector('pre').textContent=await blob.text();
 }catch(error){notify('Dokument nicht geöffnet: '+error.message,true)}
}
async function handleClick(e){if(e.target===overlay){close();return}const control=e.target.closest('[data-mrdoc]');if(!control)return;const [op,...parts]=control.dataset.mrdoc.split(':');const id=parts.join(':');if(op==='close'){close();return}if(op==='new'){state.page='new';state.selected=null;closePreview();draw();return}if(op==='list'){closePreview();state.page='list';state.selected=null;draw();return}if(op==='view'||op==='edit'){closePreview();state.selected=id;state.page=op;draw();return}if(op==='fileOpen'||op==='fileDownload'){await openFile(id,op==='fileDownload');return}if(op==='pdfBrowser'){openBrowserPDF(id);return}if(op==='pdfInline'){inlinePDF(id);return}if(op==='pdfShare'){sharePDF(id);return}if(op==='linkOpen'){const d=docs().find(x=>x.id===id);try{const url=new URL(d?.url||'');if(url.protocol==='https:')window.open(url.href,'_blank','noopener,noreferrer');else notify('Dieser Link ist nicht sicher.',true)}catch(e){notify('Der Link ist ungültig.',true)}return}if(op==='delete'){
 const x=article(),d=x?.l2documents?.find(t=>t.id===id);if(!d)return;if(!confirm('„'+d.title+'“ samt verknüpfter Datei wirklich löschen?'))return;if(state.busy)return;state.busy=true;const old=[...x.l2documents];x.l2documents=x.l2documents.filter(t=>t.id!==id);
 try{await mrDocsCommitWithState([],d.type==='file'?[id]:[]);state.page='list';state.selected=null;closePreview();draw();notify('Eintrag gelöscht.')}catch(error){x.l2documents=old;notify('Löschen fehlgeschlagen: '+error.message,true)}finally{state.busy=false}
 }}
window.MRLagerDokumente={open,close};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.articleId)close()});
})();

/* Active document-module marker, checked against index.html. */
window.MR_DOC_BUILD="1.9.7.18";
