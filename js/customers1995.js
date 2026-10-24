/* MR-Hausservice 1.9.9.5 – lokale Kundenverwaltung, bestehende db & Backups. */
(()=>{'use strict';
 const panel=document.getElementById('customers');if(!panel)return;
 const $c=sel=>panel.querySelector(sel);
 const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const makeId=()=> 'kunde_'+(typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
 const list=()=>{if(!Array.isArray(db.customers))db.customers=[];return db.customers};
 const telSafe=s=>String(s||'').replace(/[^+0-9]/g,'');
 const formDate=()=>new Date().toLocaleDateString('en-CA');
 const labels={Aktiv:'Aktiv',Interessent:'Interessent',Pausiert:'Pausiert',Archiviert:'Archiviert'};
 let query='',filter='Alle',activeId='',view='list';
 const related=c=>Array.isArray(db.work)?db.work.filter(w=>w.customerId===c.id||(!w.customerId&&String(w.customer||'').trim().toLocaleLowerCase('de')===String(c.name||'').trim().toLocaleLowerCase('de'))):[];
 const address=c=>[c.street,c.zip,c.city].map(x=>String(x||'').trim()).filter(Boolean).join(', ');
 function notice(msg,problem=false){const el=$c('#mrk-notice');if(el){el.textContent=msg;el.hidden=false;el.classList.toggle('bad',problem);setTimeout(()=>{if(el.textContent===msg)el.hidden=true},5000)}}
 function activate(){if(!panel.classList.contains('active'))goto('customers');render()}
 function render(){
  if(!panel.classList.contains('active'))return;
  const customers=list();const terms=query.trim().toLocaleLowerCase('de');
  const visible=customers.filter(c=>(filter==='Alle'?c.status!=='Archiviert':c.status===filter)&&(!terms||[c.name,c.company,c.phone,c.email,c.street,c.city,c.zip,c.workDescription,c.note].join(' ').toLocaleLowerCase('de').includes(terms))).sort((a,b)=>String(a.name).localeCompare(String(b.name),'de'));
  $c('#mrk-total').textContent=customers.filter(x=>x.status!=='Archiviert').length;
  $c('#mrk-active').textContent=customers.filter(x=>x.status==='Aktiv').length;
  $c('#mrk-interest').textContent=customers.filter(x=>x.status==='Interessent').length;
  $c('#mrk-results').textContent=`${visible.length} Einträge`;
  $c('#mrk-list').innerHTML=visible.length?visible.map(c=>{
   const orders=related(c),initials=String(c.name||'?').split(/\s+/).slice(0,2).map(v=>v[0]).join('').toLocaleUpperCase('de');
   return `<button class="mrk-customer-card" type="button" data-open-customer="${escape(c.id)}"><span class="mrk-avatar">${c.photo?`<img src="${escape(c.photo)}" alt="" loading="lazy">`:escape(initials)}</span><span class="mrk-item-body"><strong>${escape(c.name)}</strong><small>${escape(c.company||[c.zip,c.city].filter(Boolean).join(' '))||'Adresse noch ergänzen'}</small><span>${escape((c.workDescription||'').slice(0,90))||'Noch keine Tätigkeit erfasst'}</span></span><span class="mrk-side"><span class="mrk-pill ${escape(c.status||'Interessent')}">${escape(c.status||'Interessent')}</span><small>${orders.length} Aufträge</small><b>›</b></span></button>`
  }).join(''):'<div class="mrk-empty"><span>👤</span><strong>Keine passenden Kunden</strong><p>Tippe auf „Kunde anlegen“, um deinen ersten Kunden zu speichern.</p></div>';
  $c('#mrk-list-pane').hidden=view!=='list';$c('#mrk-detail-pane').hidden=view!=='detail';
  if(view==='detail'){const c=customers.find(v=>v.id===activeId);if(c)renderDetail(c);else{view='list';render()}}
 }
 function renderDetail(c){
  const works=related(c),done=works.filter(w=>w.status==='Erledigt').length;
  const last=works.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const a=address(c),taskItems=Array.isArray(c.tasks)?c.tasks:[];
  $c('#mrk-detail').innerHTML=`<div class="mrk-details-head"><div class="mrk-big-avatar">${c.photo?`<img src="${escape(c.photo)}" alt="Kundenfoto">`:'👤'}</div><div><span class="mrk-pill ${escape(c.status)}">${escape(c.status||'Interessent')}</span><h2>${escape(c.name)}</h2><p>${escape(c.company||'Privatkunde')}</p></div></div>
  <div class="mrk-actions"><button data-action="edit" type="button">✎ Bearbeiten</button><button data-action="new-work" type="button">＋ Auftrag erstellen</button><button data-action="archive" type="button">${c.status==='Archiviert'?'↗ Reaktivieren':'▣ Archivieren'}</button></div>
  <section class="mrk-block"><h3>Kontaktdaten</h3><div class="mrk-contact">${a?`<div>📍 <span>${escape(a)}</span></div>`:''}${c.phone?`<a href="tel:${escape(telSafe(c.phone))}">☎ ${escape(c.phone)}</a>`:''}${c.email?`<a href="mailto:${escape(c.email)}">✉ ${escape(c.email)}</a>`:''}${!a&&!c.phone&&!c.email?'<p>Noch keine Kontaktdaten gespeichert.</p>':''}</div></section>
  <section class="mrk-block"><h3>Gewünschte Arbeiten</h3><p class="mrk-paragraph">${escape(c.workDescription||'Noch keine Arbeiten beschrieben.')}</p><div class="mrk-meta">${c.frequency?'Wiederholung: '+escape(c.frequency):''}${c.nextVisit?' · Nächster Termin: '+escape(c.nextVisit):''}</div></section>
  <section class="mrk-block"><div class="mrk-section-title"><h3>Aufgaben beim Kunden</h3><button type="button" data-action="add-task">＋ Aufgabe</button></div><div class="mrk-task-list">${taskItems.length?taskItems.map(t=>`<label class="mrk-task"><input type="checkbox" data-task-toggle="${escape(t.id)}" ${t.done?'checked':''}><span class="${t.done?'checked':''}">${escape(t.title)}</span><button type="button" data-task-remove="${escape(t.id)}" aria-label="Aufgabe entfernen">×</button></label>`).join(''):'<p>Noch keine Kundenaufgaben.</p>'}</div></section>
  <section class="mrk-block"><h3>Aufträge &amp; Historie</h3><div class="mrk-metrics"><div><b>${works.length}</b><small>Gesamt</small></div><div><b>${done}</b><small>Erledigt</small></div><div><b>${works.length-done}</b><small>Offen</small></div></div>${last.length?last.map(w=>`<div class="mrk-order"><b>${escape(w.title)}</b><span>${escape(w.date||'Ohne Datum')} · ${escape(w.status||'Geplant')} · ${escape(w.category||'')}</span></div>`).join(''):'<p>Noch keine Aufträge zugeordnet.</p>'}</section>
  ${c.note?`<section class="mrk-block"><h3>Interne Notizen</h3><p class="mrk-paragraph">${escape(c.note)}</p></section>`:''}
  <div class="mrk-footer-actions"><button data-action="delete" type="button">Kunden endgültig löschen</button></div>`;
 }
 function showCustomer(id){activeId=id;view='detail';render();window.scrollTo({top:0,behavior:'auto'})}
 function openEditor(c){const edit=!!c;const form=$c('#mrk-edit-form');const photo=c?.photo||'';
  form.innerHTML=`<input type="hidden" name="id" value="${escape(c?.id||'')}">
  <div class="mrk-photo-row"><div class="mrk-photo-preview" id="mrk-photo-preview">${photo?`<img src="${escape(photo)}" alt="Kundenfoto">`:'👤'}</div><label>Foto (optional)<input name="photo" type="file" accept="image/*" id="mrk-photo-input"></label><label class="mrk-small-check"><input type="checkbox" name="removePhoto"> Vorhandenes Foto entfernen</label></div>
  <div class="mrk-form-grid"><label class="mrk-wide">Name / Bezeichnung *<input name="name" maxlength="120" value="${escape(c?.name||'')}" required placeholder="z. B. Nachname Vorname"></label><label class="mrk-wide">Firma (optional)<input name="company" maxlength="120" value="${escape(c?.company||'')}" placeholder="Firmenname"></label>
  <label>Telefon<input name="phone" type="tel" maxlength="60" value="${escape(c?.phone||'')}" placeholder="+43 …"></label><label>E-Mail<input name="email" type="email" maxlength="150" value="${escape(c?.email||'')}" placeholder="name@beispiel.at"></label><label class="mrk-wide">Straße, Hausnummer / Einsatzadresse<input name="street" maxlength="220" value="${escape(c?.street||'')}" placeholder="Straße und Hausnummer"></label><label>PLZ<input name="zip" maxlength="15" value="${escape(c?.zip||'')}"></label><label>Ort<input name="city" maxlength="100" value="${escape(c?.city||'')}"></label>
  <label>Status<select name="status">${Object.keys(labels).map(v=>`<option ${v===(c?.status||'Interessent')?'selected':''}>${v}</option>`).join('')}</select></label><label>Intervall<select name="frequency">${['Bei Bedarf','Einmalig','Wöchentlich','Alle 2 Wochen','Monatlich','Saisonal','Sonstiges'].map(v=>`<option ${v===(c?.frequency||'Bei Bedarf')?'selected':''}>${v}</option>`).join('')}</select></label><label>Nächster geplanter Termin<input name="nextVisit" type="date" value="${escape(c?.nextVisit||'')}"></label>
  <label class="mrk-wide">Welche Arbeiten sind gewünscht?<textarea name="workDescription" maxlength="5000" rows="4" placeholder="z. B. Rasen mähen, Hecke schneiden, Fenster reinigen">${escape(c?.workDescription||'')}</textarea></label>
  <label class="mrk-wide">Notizen / Besonderheiten<textarea name="note" maxlength="5000" rows="3" placeholder="z. B. Tor links, Material mitnehmen …">${escape(c?.note||'')}</textarea></label></div>
  <p class="mrk-privacy">Diese Daten werden nur lokal in deiner MR-Hausservice-App gespeichert und in deren Gesamtsicherung übernommen. Keine automatische Weitergabe.</p>
  <div class="mrk-form-buttons"><button type="button" data-close-editor>Abbrechen</button><button type="submit" class="mrk-primary">${edit?'Änderungen speichern':'Kunde speichern'}</button></div>`;
  $c('#mrk-dialog-title').textContent=edit?'Kunde bearbeiten':'Neuen Kunden erfassen';$c('#mrk-dialog').hidden=false;$c('#mrk-dialog').setAttribute('aria-hidden','false');form.elements.name.focus();
  const inp=$c('#mrk-photo-input');inp.addEventListener('change',async()=>{if(inp.files?.[0]){try{const file=inp.files[0];if(file.size>12*1024*1024)throw Error('Foto zu groß (maximal 12 MB).');const data=await imageData(file);$c('#mrk-photo-preview').innerHTML=`<img src="${data}" alt="Vorschau">`}catch(e){notice(e.message,true);inp.value=''}}});
 }
 function closeEditor(){const dialog=$c('#mrk-dialog');dialog.hidden=true;dialog.setAttribute('aria-hidden','true');$c('#mrk-edit-form').reset()}
 async function submit(e){e.preventDefault();const f=new FormData(e.target);const name=String(f.get('name')||'').trim();if(!name){notice('Bitte einen Namen eingeben.',true);return}
  const id=String(f.get('id')||''),existing=list().find(x=>x.id===id),photoFile=f.get('photo');
  const fields=['name','company','phone','email','street','zip','city','status','frequency','nextVisit','workDescription','note'];
  const item={...existing,id:existing?.id||makeId(),createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),tasks:Array.isArray(existing?.tasks)?existing.tasks:[]};
  for(const key of fields)item[key]=String(f.get(key)||'').trim();
  if(f.get('removePhoto'))delete item.photo;
  if(photoFile instanceof File&&photoFile.size){if(photoFile.size>12*1024*1024){notice('Foto zu groß (max. 12 MB).',true);return}try{item.photo=await imageData(photoFile)}catch(err){notice('Foto nicht lesbar: '+err.message,true);return}}
  const customers=list();const snapshot=customers.slice();if(existing){db.customers=customers.map(c=>c.id===item.id?item:c)}else db.customers=[...customers,item];
  if(await save()){closeEditor();view='detail';activeId=item.id;render();notice('Kunde gespeichert.')}else{db.customers=snapshot;notice('Kunde konnte nicht gespeichert werden.',true)}
 }
 async function updateTask(taskId,done,remove=false){const c=list().find(x=>x.id===activeId);if(!c)return;const old=structuredClone(c.tasks||[]);c.tasks=remove?old.filter(x=>x.id!==taskId):old.map(x=>x.id===taskId?{...x,done}:x);
  if(!await save()){c.tasks=old;notice('Änderung konnte nicht gespeichert werden.',true)}render()}
 async function action(name){const c=list().find(x=>x.id===activeId);if(!c)return;
  if(name==='edit')return openEditor(c);
  if(name==='new-work'){goto('projects');openForm('work');const choice=document.getElementById('f-customerId');if(choice){choice.value=c.id;choice.dispatchEvent(new Event('change',{bubbles:true}))}return}
  if(name==='add-task'){const title=prompt('Welche Aufgabe soll beim Kunden erledigt werden?');if(title===null)return;const text=title.trim();if(!text)return;const old=structuredClone(c.tasks||[]);c.tasks=[...old,{id:makeId(),title:text.slice(0,250),done:false}];if(!await save()){c.tasks=old;notice('Aufgabe konnte nicht gespeichert werden.',true)}return render()}
  if(name==='archive'){const before=c.status;c.status=c.status==='Archiviert'?'Aktiv':'Archiviert';if(!await save()){c.status=before;notice('Status konnte nicht gespeichert werden.',true)}render();return}
  if(name==='delete'){const works=related(c);if(works.length){notice('Dieser Kunde hat Aufträge. Bitte archivieren statt löschen.',true);return}if(!confirm(`Kunden „${c.name}“ wirklich endgültig löschen? Diese Aktion ist nicht rückgängig zu machen.`))return;
    const snapshot=list().slice();db.customers=snapshot.filter(x=>x.id!==c.id);if(await save()){view='list';activeId='';render();notice('Kunde gelöscht.')}else{db.customers=snapshot;notice('Löschen fehlgeschlagen.',true)}
  }
 }
 panel.addEventListener('click',e=>{const c=e.target.closest('[data-open-customer]');if(c)return showCustomer(c.dataset.openCustomer);const b=e.target.closest('[data-action]');if(b)return action(b.dataset.action);if(e.target.closest('[data-close-editor]'))return closeEditor();const rem=e.target.closest('[data-task-remove]');if(rem)return updateTask(rem.dataset.taskRemove,false,true)});
 panel.addEventListener('change',e=>{const t=e.target.closest('[data-task-toggle]');if(t)updateTask(t.dataset.taskToggle,t.checked)});
 panel.addEventListener('submit',e=>{if(e.target.matches('#mrk-edit-form'))submit(e)});
 $c('#mrk-new').addEventListener('click',()=>openEditor(null));$c('#mrk-search').addEventListener('input',e=>{query=e.target.value;render()});$c('#mrk-filter').addEventListener('change',e=>{filter=e.target.value;render()});$c('#mrk-back').addEventListener('click',()=>{view='list';render()});
 $c('#mrk-dialog').addEventListener('click',e=>{if(e.target.id==='mrk-dialog')closeEditor()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$c('#mrk-dialog').hidden)closeEditor()});
 new MutationObserver(()=>{if(panel.classList.contains('active'))render()}).observe(panel,{attributes:true,attributeFilter:['class']});
 window.customerChoice1995=function(w){const customers=list().filter(c=>c.status!=='Archiviert').sort((a,b)=>String(a.name).localeCompare(String(b.name),'de'));
  const matched=w.customerId||customers.find(c=>c.name.trim().toLocaleLowerCase('de')===String(w.customer||'').trim().toLocaleLowerCase('de'))?.id||'';
  return `<label for="f-customerId">Kunde aus Kundenverwaltung (optional)</label><select class="input" id="f-customerId" name="customerId"><option value="">Kein Kunde ausgewählt</option>${customers.map(c=>`<option value="${escape(c.id)}" ${matched===c.id?'selected':''}>${escape(c.name)}${c.city?' – '+escape(c.city):''}</option>`).join('')}</select><small class="hint">Auswahl übernimmt den Namen, die feste Verknüpfung erscheint in der Kundenhistorie.</small><label for="f-customer">Kunde / Ort (Freitext)</label><input class="input" id="f-customer" name="customer" value="${escape(w.customer||'')}" placeholder="Kunde oder Einsatzort"><div id="mrk-work-location" class="mrk-work-location"></div>`;
 };
 window.customerSelected1995=function(id){return list().find(x=>x.id===id)};
 document.addEventListener('change',e=>{if(e.target.id==='f-customerId'){const c=window.customerSelected1995(e.target.value);const input=document.getElementById('f-customer');if(c&&input)input.value=c.name;const box=document.getElementById('mrk-work-location');if(box)box.textContent=c?address(c):''}});
 window.MR_CUSTOMERS1995={getCustomers:()=>list(),related,show:()=>{activate()},refresh:render};
})();
