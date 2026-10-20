// MR-Hausservice V1.9.6.3 — responsive work editor; existing fields/data retained.
function setupWorkLayout1963(){
  const root=document.getElementById('fields');
  if(!root || !document.getElementById('f-title'))return;
  const form=document.getElementById('entry-form');
  form.classList.add('work-editor-1963');
  const modal=document.querySelector('#overlay .modal');
  modal.classList.add('work-modal-1963');
  document.getElementById('modal-title').textContent=edit&&edit.id?'Auftrag bearbeiten':'Auftrag anlegen';
  const card=(heading,klass)=>{const e=document.createElement('section');e.className='work1963-card '+(klass||'');const h=document.createElement('h3');h.textContent=heading;e.append(h);return e};
  const header=card('Art des Auftrags','work1963-kind');
  const data=card('📋 Auftragsdaten','work1963-data');
  const time=card('⏱ Arbeitszeit & Preis','work1963-time');
  const official=card('🧾 Offizielle Abrechnung','work1963-official');
  const notes=card('📝 Leistungen & Notizen','work1963-notes');
  const summary=card('✓ Zusammenfassung','work1963-summary');
  const extra=card('Weitere Angaben','work1963-extra');
  function moveField(name,dest){const label=root.querySelector('label[for="f-'+name+'"]');if(!label)return;const control=label.nextElementSibling;const wrap=document.createElement('div');wrap.className='work1963-field';wrap.append(label);if(control)wrap.append(control);dest.append(wrap)}
  function moveId(id,dest){const el=document.getElementById(id);if(el)dest.append(el)}
  const kind=root.querySelector('.work-kind-panel');if(kind){const oldTitle=kind.querySelector('strong');if(oldTitle)oldTitle.remove();header.append(kind)}
  moveField('title',data);
  const grid=document.createElement('div');grid.className='work1963-grid';data.append(grid);
  for(const name of ['customer','category','date','workStatus','projectId'])moveField(name,grid);
  moveId('work-kind-private',time);
  const manual=document.getElementById('f-manualHours');if(manual){const row=manual.closest('.row');if(row)time.append(row)}
  moveField('hourlyRate',time);moveId('work-estimate1962',time);
  moveId('work-kind-official',official);
  moveField('tasklist',notes);moveField('note',notes);
  const paid=document.getElementById('f-paid');if(paid){const row=paid.closest('.row');if(row)notes.append(row)}
  // Preserve auxiliary elements, including helper texts, instead of losing form fields.
  const remaining=[...root.children].filter(e=>!([header,data,time,official,notes,summary,extra].includes(e)));
  for(const el of remaining)extra.append(el);
  const summaryContent=document.createElement('div');summaryContent.id='work1963-preview';summaryContent.setAttribute('aria-live','polite');summary.append(summaryContent);
  root.replaceChildren(header,data,time,official,notes,summary);
  if(extra.childElementCount>1)root.append(extra);
  const originalUpdate=()=>{const fd=new FormData(form);const kind=fd.get('workKind')||'Privat';official.hidden=kind!=='Offiziell';const hrs=Number(fd.get('manualHours'))||0;const mins=Number(fd.get('manualRemainder'))||0;const rate=Math.max(0,Number(fd.get('hourlyRate'))||0);const net=Math.round((hrs+mins/60)*rate*100)/100;const taxMode=String(fd.get('taxMode')||'');const tax=kind==='Offiziell'?(taxMode.includes('(20 %)')?.2:taxMode.includes('(10 %)')?.1:taxMode.includes('(13 %)')?.13:0):0;const euroText=n=>new Intl.NumberFormat('de-AT',{style:'currency',currency:'EUR'}).format(n);const title=String(fd.get('title')||'Noch kein Titel');const safe=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));summaryContent.innerHTML='<div class="work1963-preview-grid"><div><small>Auftrag</small><b>'+safe(title)+'</b></div><div><small>Art</small><b>'+safe(kind)+'</b></div><div><small>Arbeitszeit</small><b>'+hrs+' h '+mins+' min</b></div><div><small>'+ (kind==='Offiziell'?'Gesamt inkl. USt.':'Berechneter Betrag')+'</small><b>'+euroText(net*(1+tax))+'</b></div></div>';};
  // The already-installed setupWorkKind1962 listens on root.oninput/onchange.
  // Keep these handlers, then update the compact preview on the same events.
  root.addEventListener('input',originalUpdate);
  root.addEventListener('change',originalUpdate);
  originalUpdate();
}
