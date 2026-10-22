

// V1.9.5.1.1 Funktionen aktiv. Bestehende IndexedDB-Datenbank unverändert.

// V1.9.5.1.1: einheitliche Navigation und personalisierbare Schnellzugriffe.
const PREMIUM_QUICK_ITEMS=[
 {id:'work',label:'Arbeit',sub:'Neue Arbeit',symbol:'＋',mode:'open'},
 {id:'photo',label:'Auftragsfotos',sub:'Bei Arbeiten',symbol:'▣',mode:'go',target:'projects'},
 {id:'stock',label:'Lager',sub:'Material & Geräte',symbol:'⬡',mode:'go'},
 {id:'stats',label:'Statistik',sub:'Auswertungen',symbol:'▥',mode:'go'},
 {id:'calendar',label:'Kalender',sub:'Termine planen',symbol:'▦',mode:'calendar'},
 {id:'projects',label:'Arbeiten',sub:'Alle Arbeiten',symbol:'☷',mode:'go'},
 {id:'finance',label:'Finanzen',sub:'Einnahmen',symbol:'€',mode:'go'},
 {id:'profile',label:'Backup',sub:'Sicherungen',symbol:'☁',mode:'go'}
];
const PREMIUM_DEFAULT=['work','projects','stock','stats'];
function premiumQuickSelection(){const raw=Array.isArray(settings.quick195)?settings.quick195:PREMIUM_DEFAULT;const safe=[...new Set(raw)].filter(v=>PREMIUM_QUICK_ITEMS.some(a=>a.id===v));return safe.length===4?safe:PREMIUM_DEFAULT}
function premiumRenderQuick(){const el=$('#premium-quick-grid');if(!el)return;el.innerHTML=premiumQuickSelection().map(id=>{const x=PREMIUM_QUICK_ITEMS.find(q=>q.id===id);return `<button type="button" class="quick" data-premium-quick="${x.id}" aria-label="${esc(x.label)}"><strong>${x.symbol}</strong>${esc(x.label)}<small>${esc(x.sub)}</small></button>`}).join('')}
function premiumConfigOpen(){const chosen=premiumQuickSelection();$('#premium-config-list').innerHTML=PREMIUM_QUICK_ITEMS.map(x=>`<label class="premium-config-option"><input type="checkbox" value="${x.id}" ${chosen.includes(x.id)?'checked':''}><span>${x.symbol} ${esc(x.label)}</span></label>`).join('');$('#premium-config-modal').classList.add('show');$('#premium-config-modal').setAttribute('aria-hidden','false')}
function premiumConfigClose(){$('#premium-config-modal').classList.remove('show');$('#premium-config-modal').setAttribute('aria-hidden','true')}
$('#premium-config-open')?.addEventListener('click',premiumConfigOpen);
$('#premium-config-close')?.addEventListener('click',premiumConfigClose);
$('#premium-config-modal')?.addEventListener('click',e=>{if(e.target.id==='premium-config-modal')premiumConfigClose()});
$('#premium-config-reset')?.addEventListener('click',()=>{$$('#premium-config-list input').forEach(el=>el.checked=PREMIUM_DEFAULT.includes(el.value))});
$('#premium-config-save')?.addEventListener('click',()=>{const ids=$$('#premium-config-list input:checked').map(el=>el.value);if(ids.length!==4){alert('Bitte genau vier Schnellzugriffe auswählen.');return}settings.quick195=ids;try{saveSettings();premiumRenderQuick();premiumConfigClose();flash193('✓ Schnellzugriffe gespeichert')}catch(e){alert('Auswahl konnte nicht gespeichert werden: '+e.message)}});
$('#premium-quick-grid')?.addEventListener('click',e=>{const b=e.target.closest('[data-premium-quick]');if(!b)return;const x=PREMIUM_QUICK_ITEMS.find(q=>q.id===b.dataset.premiumQuick);if(!x)return;if(x.mode==='open')openForm(x.id);else if(x.mode==='calendar'){const cal=$('[data-calendar-open]');if(cal)cal.click();else goto('calendar')}else goto(x.target||x.id)});
// Zurück aus Unterseiten: vorherige Hauptseite statt stets Start. Keine Browser-History-Manipulation.
const premiumBackStack=[];
const premiumOriginalGoto=goto;
goto=function(page){const active=$('.page.active');if(active&&active.id!==page){premiumBackStack.push({page:active.id,scroll:window.scrollY});if(premiumBackStack.length>25)premiumBackStack.shift()}premiumOriginalGoto(page);premiumRefreshBacks();premiumRenderQuick()};
function premiumGoBack(){const item=premiumBackStack.pop();if(!item){goto('home');return}premiumOriginalGoto(item.page);premiumRefreshBacks();premiumRenderQuick();requestAnimationFrame(()=>window.scrollTo(0,item.scroll||0))}
function premiumRefreshBacks(){ $$('.page').forEach(page=>{if(page.id==='home')return;let holder=page.querySelector('.premium-page-tools');if(!holder){holder=document.createElement('div');holder.className='premium-page-tools';holder.innerHTML='<button class="premium-back" type="button">← Zurück</button>';page.prepend(holder)}holder.querySelector('.premium-back').onclick=premiumGoBack}) }
function premiumLocalStatus(kind='local'){const el=$('#premium-local-indicator');if(!el)return;el.dataset.cloud=kind==='cloud'?'true':'false';el.textContent=kind==='cloud'?'☁ Cloud gesichert':kind==='saving'?'◌ Speichert …':kind==='error'?'⚠ Speicherfehler':'● Lokal gespeichert'}
// Nur lokal gespeicherte Daten als lokal kennzeichnen. Cloud-Erfolg ausschließlich nach bestätigtem Upload.
const premiumOriginalSave=save;
save=async function(){premiumLocalStatus('saving');const ok=await premiumOriginalSave();premiumLocalStatus(ok?'local':'error');return ok};
premiumRenderQuick();premiumRefreshBacks();premiumLocalStatus('local');
