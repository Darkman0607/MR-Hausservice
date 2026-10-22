/* MR Hausservice V1.9.7.12 – Kalender 2.0. Nur Darstellung/Ansichtsmodus; Termine, Datenbank und Formulare bleiben erhalten. */
(()=>{
'use strict';
const allowed=['month','week','day'];
let mode='week';
try{const saved=localStorage.getItem('mr_calendar_view_19712');if(allowed.includes(saved))mode=saved}catch(e){}
const legacyRender=renderCalendar;
const weekStart=day=>{const d=new Date(day+'T12:00:00');const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);return isoDay(d)};
const monthTitle=month=>new Date(month+'-01T12:00:00').toLocaleDateString('de-AT',{month:'long',year:'numeric'});
const dLabel=day=>new Date(day+'T12:00:00').toLocaleDateString('de-AT',{weekday:'short',day:'numeric',month:'short'});
const categoriesForDate=(key)=>{
 const acts=apptsOnDay(key),works=(db.work||[]).filter(w=>w.date===key);
 return {acts,works,private:acts.some(a=>a.category==='Privat'),done:acts.some(a=>a.status==='Erledigt')||works.some(w=>w.status==='Erledigt'),work:works.some(w=>w.status!=='Erledigt'&&w.status!=='Abgesagt')||acts.some(a=>a.category!=='Privat'&&a.status!=='Erledigt'&&a.status!=='Abgesagt'),cancelled:acts.some(a=>a.status==='Abgesagt'),count:acts.length+works.length};
};
const dateButton=(key,outside=false)=>{
 const c=categoriesForDate(key),isSelected=selectedDay===key,isToday=today()===key;
 const markers=[];
 if(c.work)markers.push('<span class="cal12-dot work" aria-label="Arbeit geplant"></span>');
 if(c.done)markers.push('<span class="cal12-dot done" aria-label="Arbeit erledigt"></span>');
 if(c.private)markers.push('<span class="cal12-dot private" aria-label="Privater Termin"></span>');
 if(c.cancelled)markers.push('<span class="cal12-dot cancelled" aria-label="Abgesagt"></span>');
 const named=key+' · '+c.count+' Einträge';
 return `<button type="button" data-calendar-day="${key}" class="cal12-cell ${outside?'other':''} ${isSelected?'selected':''} ${isToday?'today':''}" aria-pressed="${isSelected}" aria-label="${esc(named)}"><strong>${Number(key.slice(8))}</strong><span class="cal12-markers">${markers.slice(0,3).join('')}${markers.length>3?'<i>+</i>':''}</span></button>`;
};
const calendarGrid=()=>{
 const grid=document.getElementById('calendar-month');
 const title=document.getElementById('calendar-month-title');
 const sub=document.getElementById('cal12-period-subtitle');
 if(!grid||!title)return;
 document.querySelectorAll('[data-cal12-mode]').forEach(btn=>{const active=btn.dataset.cal12Mode===mode;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
 if(mode==='month'){
  const first=new Date(calendarMonth+'-01T12:00:00');
  const offset=(first.getDay()+6)%7;
  const days=Array.from({length:42},(_,i)=>{const d=new Date(first);d.setDate(i+1-offset);return isoDay(d)});
  title.textContent=monthTitle(calendarMonth);sub.textContent='Monatsübersicht';
  grid.className='calendar-month cal12-grid cal12-grid-month';
  grid.innerHTML=['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span class="cal12-weekday">${x}</span>`).join('')+days.map(x=>dateButton(x,x.slice(0,7)!==calendarMonth)).join('');
 }else if(mode==='week'){
  const first=weekStart(selectedDay),days=Array.from({length:7},(_,i)=>dayShift(first,i));
  title.textContent=monthTitle(selectedDay.slice(0,7));sub.textContent=dLabel(first)+' – '+dLabel(days[6]);
  grid.className='calendar-month cal12-grid cal12-grid-week';
  grid.innerHTML=['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span class="cal12-weekday">${x}</span>`).join('')+days.map(x=>dateButton(x)).join('');
 }else{
  title.textContent=displayDay(selectedDay);sub.textContent='Tagesansicht';
  grid.className='calendar-month cal12-grid cal12-grid-day';
  grid.innerHTML=`<div class="cal12-day-focus"><strong>${Number(selectedDay.slice(8))}</strong><span>${dLabel(selectedDay)} · ${categoriesForDate(selectedDay).count} Einträge</span></div>`;
 }
};
const entryType=(item,work=false)=>{
 if(item.status==='Abgesagt')return {type:'cancelled',icon:'⊘',label:'Abgesagt'};
 if(item.status==='Erledigt')return {type:'done',icon:'✓',label:'Erledigt'};
 if(!work&&item.category==='Privat')return {type:'private',icon:'⌂',label:'Privat'};
 if(item.status==='In Arbeit')return {type:'working',icon:'◷',label:'In Arbeit'};
 return {type:'work',icon:'⚒',label:'Geplant'};
};
const hourForWork=w=>{
 // Ein Arbeitsauftrag hat nicht zwangsläufig eine geplante Uhrzeit.
 if(/^\d{2}:\d{2}$/.test(w.start||''))return w.start;
 if(/^\d{2}:\d{2}$/.test(w.startTime||''))return w.startTime;
 const session=(w.sessions||[]).find(s=>s.start?.slice(0,10)===selectedDay);
 return session?new Date(session.start).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'}):'';
};
const timeline=()=>{
 const target=document.getElementById('calendar-day-entries');
 if(!target)return;
 const entries=[];
 for(const a of apptsOnDay(selectedDay)){
  const type=entryType(a),count=(a.images||[]).length;
  entries.push({start:a.start||'',markup:`<article class="cal12-event ${type.type}"><span class="cal12-time">${esc(a.start||'–:–')}</span><span class="cal12-symbol" aria-hidden="true">${type.icon}</span><div class="cal12-event-body"><b>${esc(a.title||'Termin')}</b><small>${esc([a.place,a.category].filter(Boolean).join(' · ')||'Termin')}${a.end?' · bis '+esc(a.end):''}</small><div class="cal12-chips"><span class="cal12-chip ${type.type}">${type.label}</span>${a.note?'<span class="cal12-chip">▤ Notiz</span>':''}${count?`<span class="cal12-chip">▣ ${count} Foto${count===1?'':'s'}</span>`:''}${a.repeat&&a.repeat!=='none'?'<span class="cal12-chip">↻ Wiederholt</span>':''}</div></div><button class="cal12-event-open" type="button" data-edit-appt="${esc(a.id)}" aria-label="Termin ${esc(a.title||'')} öffnen">›</button></article>`});
 }
 const works=(db.work||[]).filter(w=>w.date===selectedDay||workHoursForDate(w,selectedDay)>0);
 for(const w of works){
  const type=entryType(w,true),start=hourForWork(w);const count=(w.beforePhotos||[]).length+(w.afterPhotos||[]).length;
  const hours=workHoursForDate(w,selectedDay),time=hours>0?` · ${mr1961Hours(hours)}`:'';
  entries.push({start,markup:`<article class="cal12-event ${type.type}"><span class="cal12-time">${esc(start||'—')}</span><span class="cal12-symbol" aria-hidden="true">${type.icon}</span><div class="cal12-event-body"><b>${esc(w.title||'Arbeit')}</b><small>${esc(w.category||'Arbeitsauftrag')}${time}</small><div class="cal12-chips"><span class="cal12-chip ${type.type}">${type.label}</span>${w.note?'<span class="cal12-chip">▤ Notiz</span>':''}${count?`<span class="cal12-chip">▣ ${count} Fotos</span>`:''}${(w.materials||[]).length?'<span class="cal12-chip">⬡ Material</span>':''}</div></div><button class="cal12-event-open" type="button" data-work-detail="${esc(w.id)}" aria-label="Arbeit ${esc(w.title||'')} öffnen">›</button></article>`});
 }
 entries.sort((a,b)=>(a.start?'0':'1') .localeCompare(b.start?'0':'1')||a.start.localeCompare(b.start));
 target.innerHTML=entries.length?entries.map(v=>v.markup).join(''):'<div class="cal12-empty"><span>▦</span><strong>Für diesen Tag ist noch nichts eingetragen.</strong><small>Mit „Neuer Termin“ kannst du deinen Tag planen.</small></div>';
};
function enhancedRender(){legacyRender();calendarGrid();timeline()}
renderCalendar=enhancedRender;
const monthChange=(step)=>{
 const d=new Date(calendarMonth+'-01T12:00:00');d.setMonth(d.getMonth()+step);
 const newMonth=isoDay(d).slice(0,7);
 const originalDay=Number(selectedDay.slice(8));
 const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
 selectedDay=newMonth+'-'+String(Math.min(originalDay,last)).padStart(2,'0');calendarMonth=newMonth;
};
document.addEventListener('click',e=>{
 const modeBtn=e.target.closest('[data-cal12-mode]');
 if(modeBtn){mode=modeBtn.dataset.cal12Mode;if(!allowed.includes(mode))return;try{localStorage.setItem('mr_calendar_view_19712',mode)}catch(e){};calendarMonth=selectedDay.slice(0,7);renderCalendar();return}
 const nav=e.target.closest('[data-cal12-nav]');if(!nav)return;
 const step=nav.dataset.cal12Nav==='prev'?-1:1;
 if(mode==='month')monthChange(step);
 else{selectedDay=dayShift(selectedDay,step*(mode==='week'?7:1));calendarMonth=selectedDay.slice(0,7)}
 renderCalendar();
});
})();
