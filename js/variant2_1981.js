/* UI integration V1.9.8.1 - no state rewrite of existing MR data. */
(function(){
'use strict';
const ALLOWED=new Set(['home','diary','calendar','learn','selfcheck','records']);
function openWomen(target='home'){
 if(!ALLOWED.has(target))target='home';
 // V1.9.8.2: The redesigned bottom bar has no hidden Frauen-App tab; route directly.
 if(typeof window.goto==='function')window.goto('mrp-women');
 else document.querySelector('[data-mrp-go="mrp-women"]')?.click();
 const frame=document.getElementById('mrw-frame');if(!frame)return;
 const send=()=>{try{frame.contentWindow?.postMessage({type:'mr-women-navigate',target},location.origin)}catch(e){console.warn('Navigation Frauen-App:',e)}};
 document.querySelectorAll('.mrw-section-tabs [data-mrw-open], .mrw-premium-bottom [data-mrw-open]').forEach(b=>{const active=b.dataset.mrwOpen===target;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 if(!frame.hasAttribute('src')){frame.addEventListener('load',send,{once:true});frame.setAttribute('src',frame.dataset.src)}else send();
}
document.addEventListener('click',e=>{
 const revert=e.target.closest('[data-mrw-revert-vault]');if(revert){
   e.preventDefault();(async()=>{try{
    if(typeof storage==='undefined'||!storage)throw Error('Datenspeicher nicht bereit');
    const point=await new Promise((res,rej)=>{const tx=storage.transaction('state','readonly');const r=tx.objectStore('state').get('women_pre_restore');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
    if(!point?.vault)throw Error('Noch kein Frauen-App-Schutzpunkt vorhanden. Er entsteht bei der Wiederherstellung eines verschlüsselten Gesamtsicherungsstands.');
    if(!confirm('Frauen-App-Daten des Schutzpunkts vom '+new Date(point.created).toLocaleString('de-AT')+' wiederherstellen? Alle aktuellen Gesundheitsdaten werden ersetzt. Bitte vorher zusätzlich sichern.'))return;
    await mrWomenVaultRestore(point.vault);alert('Frauen-App-Schutzpunkt wiederhergestellt. Bitte Frauen-App wieder öffnen und entsperren.');
   }catch(err){alert('Schutzpunkt: '+err.message)}})();return;
 }
 const el=e.target.closest('[data-mrw-open]');if(el){e.preventDefault();openWomen(el.dataset.mrwOpen);return}
 const nav=e.target.closest('[data-mrp-go="mrp-women"]');if(nav){const frame=document.getElementById('mrw-frame');if(frame&&!frame.hasAttribute('src'))frame.setAttribute('src',frame.dataset.src)}
});
// Eingebettete Seite füllt die Hauptseite, anstatt eine zweite scrollbare App darzustellen.
window.addEventListener('message',event=>{
 const frame=document.getElementById('mrw-frame');
 if(!frame||event.origin!==location.origin||event.source!==frame.contentWindow)return;
 if(event.data?.type==='mr-women-height'){
   const height=Number(event.data.height);
   if(Number.isFinite(height)&&height>=240&&height<=30000){
     const current=parseFloat(frame.style.height||'0');
     if(Math.abs(current-height)>3)frame.style.height=Math.ceil(height)+'px';
   }
 }
 if(event.data?.type==='mr-women-page'){
   const page=String(event.data.target||'');
   document.querySelectorAll('.mrw-section-tabs [data-mrw-open], .mrw-premium-bottom [data-mrw-open]').forEach(b=>{const active=b.dataset.mrwOpen===page;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 }
});
window.MR_V2_OPEN_WOMEN=openWomen;
})();
