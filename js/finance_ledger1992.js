/* Vereinheitlichte Sicht auf tatsächliche Geldbewegungen: keine doppelten Buchungen.
   Verbuchung nur aus Finanztransaktionen, Fahrzeugbuchungen, tatsächlichen Arbeitseinnahmen und bezahlten Geräteservices.
   Materialverbrauch / Lagerwerte / Übungsbeträge sind KEINE tatsächlichen Zahlungen. */
(()=>{'use strict';
const positive=n=>{const x=Number(n);return Number.isFinite(x)&&x>0?Math.round(x*100)/100:0};
const rows=()=>{
 if(typeof db==='undefined'||!db)return [];
 const out=[],push=(x)=>{if(x.amount>0&&/^\d{4}-\d{2}-\d{2}$/.test(x.date||''))out.push(x)};
 const f=db.personal?.finance||{};
 (Array.isArray(f.transactions)?f.transactions:[]).forEach(t=>push({id:'fin:'+t.id,date:t.date,title:String(t.title||'Buchung'),amount:positive(t.amount),type:t.type==='Einnahme'?'Einnahme':'Ausgabe',scope:t.scope==='Gewerbe'?'Gewerbe':'Privat',source:'Buchungen',category:String(t.category||'Sonstiges'),account:String(t.account||''),note:String(t.note||''),editable:true,link:'mrp-finance'}));
 (Array.isArray(db.personal?.vehicles?.records)?db.personal.vehicles.records:[]).forEach(r=>push({id:'vehicle:'+r.id,date:r.date,title:String(r.title||r.type||'Fahrzeug'),amount:positive(r.amount),type:r.type==='Erstattung'?'Einnahme':'Ausgabe',scope:r.scope==='Gewerbe'?'Gewerbe':'Privat',source:'Fahrzeug',category:r.type==='Tanken'?'Tanken':'Fahrzeug '+String(r.type||'Ausgabe'),account:String(r.account||''),note:String(r.note||''),editable:false,link:'mrp-vehicles'}));
 (Array.isArray(db.work)?db.work:[]).forEach(w=>push({id:'work:'+w.id,date:w.date,title:String(w.title||'Arbeit'),amount:positive(w.paid),type:'Einnahme',scope:w.workKind==='Offiziell'?'Gewerbe':'Privat',source:'Hausservice',category:'Arbeit · tatsächlich erhalten',account:'',note:w.workKind==='Offiziell'?'Offiziell':'Private Arbeit',editable:false,link:'work'}));
 (Array.isArray(db.personal?.household?.devices)?db.personal.household.devices:[]).forEach(d=>{(Array.isArray(d.history)?d.history:[]).forEach((h,i)=>push({id:'household-service:'+d.id+':'+(h.id||i),date:h.date,title:'Geräteservice: '+String(d.title||'Gerät'),amount:positive(h.cost),type:'Ausgabe',scope:'Privat',source:'Haushalt',category:'Haushalt & Putzen',account:'',note:String(h.note||''),editable:false,link:'mrp-household'}))});
 return out.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
};
const totals=(list)=>{let income=0,expense=0;for(const r of list){if(r.type==='Einnahme')income+=r.amount;else expense+=r.amount;}return {income:Math.round(income*100)/100,expense:Math.round(expense*100)/100,balance:Math.round((income-expense)*100)/100}};
const byMonth=(list,m)=>list.filter(r=>r.date.startsWith(m));
window.MR_LEDGER1992={rows,totals,byMonth,refresh:()=>window.MR_FINANCE1991?.refresh?.()};
})();
