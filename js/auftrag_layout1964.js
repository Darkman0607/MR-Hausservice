// V1.9.6.4 – compact card workflow for work form. Existing inputs and persistence remain authoritative.
function setupWorkLayout1964(){
 const form=document.getElementById('entry-form'),root=document.getElementById('fields');
 if(!form||!root||!document.getElementById('f-title'))return;
 form.classList.add('work-editor-1964');
 const modal=document.querySelector('#overlay .modal');modal.classList.add('work-modal-1964');
 document.getElementById('modal-title').textContent=edit&&edit.id?'✎ Auftrag bearbeiten':'＋ Auftrag anlegen';
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
 const card=(title,cls)=>{const c=el('section','work1964-card '+cls);c.append(el('h3','',title));return c};
 const kind=card('Auftragstyp','work1964-kind');
 const basics=card('✎ Auftrag','work1964-basics');
 const time=card('◷ Arbeitszeit','work1964-time');
 const activity=card('⚒ Tätigkeit / Kategorie','work1964-activity');
 const customer=card('♙ Kunde / Ort','work1964-customer');
 const price=card('€ Stundensatz','work1964-price');
 const official=card('▤ Offizielle Abrechnung','work1964-official');
 const tasks=card('☑ Arbeitsschritte','work1964-tasks');
 const note=card('▤ Beschreibung','work1964-notes');
 const extra=card('Weitere Angaben','work1964-extra');
 const summary=card('✓ Zusammenfassung','work1964-summary');
 const nav=el('div','work1964-shortcuts');
 const row=el('div','work1964-grid');
 const oldKind=root.querySelector('.work-kind-panel');if(oldKind){const heading=oldKind.querySelector('strong');if(heading)heading.remove();kind.append(oldKind)}
 function moveField(name,dest){const control=root.querySelector('#f-'+name);if(!control)return;const label=root.querySelector('label[for="f-'+name+'"]');const wrap=el('div','work1964-field');if(label)wrap.append(label);wrap.append(control);dest.append(wrap)}
 function moveId(id,dest){const element=document.getElementById(id);if(element)dest.append(element)}
 moveField('title',basics);moveField('date',basics);
 const statusBlock=el('div','work1964-secondary');moveField('workStatus',statusBlock);moveField('projectId',statusBlock);basics.append(statusBlock);
 const privateDetail=document.getElementById('work-kind-private');if(privateDetail)time.append(privateDetail);
 const hours=document.getElementById('f-manualHours');if(hours&&hours.closest('.row'))time.append(hours.closest('.row'));
 moveId('work-estimate1962',time);moveField('category',activity);moveField('customer',customer);moveField('hourlyRate',price);
 moveId('work-kind-official',official);
 moveField('tasklist',tasks);moveField('note',note);
 const payment=document.getElementById('f-paid');if(payment&&payment.closest('.row'))extra.append(payment.closest('.row'));
 const remaining=[...root.children];for(const e of remaining)extra.append(e);
 const preview=el('div','work1964-preview');preview.id='work1964-preview';preview.setAttribute('aria-live','polite');summary.append(preview);
 const links=[['Auftrag',basics],['Zeit',time],['Leistung',activity],['Notizen',note],['Übersicht',summary]];
 for(const [title,target] of links){const b=el('button','work1964-nav-btn',title);b.type='button';b.addEventListener('click',()=>{target.scrollIntoView({behavior:'smooth',block:'start'});if(target.tagName==='DETAILS')target.open=true});nav.append(b)}
 const head=el('div','work1964-intro');head.append(el('strong','',edit&&edit.id?'Auftrag bearbeiten':'Neuen Auftrag erfassen'),el('small','','Privat oder offiziell · kompakte Kartenansicht'));
 row.append(basics,time,activity,customer,price,official,tasks,note);
 const media=card('📷 Fotos, Videos & Materialien','work1964-media');
 media.append(el('p','',edit&&edit.id?'Medien und Material direkt in der Auftragsansicht ergänzen.':'Nach dem Speichern kannst du Fotos, Videos und Materialien diesem Auftrag zuordnen.'));
 if(edit&&edit.id){const go=el('button','secondary','Auftrag öffnen →');go.type='button';go.onclick=()=>{const id=edit.id;closeForm();goto('projects');const node=[...document.querySelectorAll("[data-work-detail]")].find(n=>n.dataset.workDetail===id);if(node)node.click()};media.append(go)}
 const more=el('details','work1964-more');more.append(el('summary','','Zusätzliche Angaben & interne Werte'));more.append(extra);
 root.replaceChildren(head,kind,nav,row,media,more,summary);
 function update(){const fd=new FormData(form),isOfficial=fd.get('workKind')==='Offiziell';official.hidden=!isOfficial;const hh=Math.max(0,+fd.get('manualHours')||0),mm=Math.max(0,+fd.get('manualRemainder')||0),rate=Math.max(0,+fd.get('hourlyRate')||0),net=(hh+mm/60)*rate;const taxMode=String(fd.get('taxMode')||'');const tax=isOfficial?(taxMode.includes('(20 %)')?.2:taxMode.includes('(10 %)')?.1:taxMode.includes('(13 %)')?.13:0):0;const money=n=>new Intl.NumberFormat('de-AT',{style:'currency',currency:'EUR'}).format(n);const txt=v=>String(v||'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  preview.innerHTML='<div><small>Auftrag</small><b>'+txt(fd.get('title'))+'</b></div><div><small>Typ</small><b>'+ (isOfficial?'Offiziell':'Privat')+'</b></div><div><small>Zeit</small><b>'+hh+' h '+mm+' min</b></div><div><small>'+(isOfficial?'Gesamt inkl. USt.':'Betrag (Schätzung)')+'</small><b>'+money(net*(1+tax))+'</b></div>';
  kind.querySelectorAll('.work-kind-toggle label').forEach(l=>l.classList.toggle('selected',!!l.querySelector('input:checked')));
 }
 root.addEventListener('input',update);root.addEventListener('change',update);update();
}
