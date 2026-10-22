/* MR-Hausservice V1.9.7.11: single source of truth for stock statistics. */
(()=>{'use strict';
 const filled=v=>v!==null&&v!==undefined&&String(v).trim()!==''&&typeof v!=='boolean'&&Number.isFinite(Number(v))&&Number(v)>=0;
 const locations=x=>Array.isArray(x?.locations)?x.locations:[];
 const values=x=>{const loc=locations(x);return loc.length?loc.map(l=>l?.quantity):(x&&Object.prototype.hasOwnProperty.call(x,'quantity')?[x.quantity]:[])};
 const hasQuantity=x=>values(x).length>0&&values(x).every(filled);
 const quantity=x=>values(x).reduce((n,v)=>n+(filled(v)?Number(v):0),0);
 const quantityLabel=x=>hasQuantity(x)?String(Math.round(quantity(x)*100)/100):'Menge fehlt';
 const kind=x=>{if(x?.l2kind==='geraet'||x?.l2kind==='verbrauch')return x.l2kind;const t=[x?.category,x?.title].join(' ').toLowerCase();return /werkzeug|gerät|maschine|schrauber|säge|rasenmäher|heckenschere|freischneider|leiter|bohrer|hammer|zange/.test(t)?'geraet':'verbrauch'};
 const needsReorder=x=>kind(x)==='verbrauch'&&x?.l2alert===true&&filled(x?.minimum)&&hasQuantity(x)&&quantity(x)<=Number(x.minimum);
 const missingFields=x=>{const missing=[];if(!(Array.isArray(x?.images)&&x.images.some(Boolean))&&!x?.image)missing.push('Foto');if(!x?.unit||!String(x.unit).trim())missing.push('Einheit');if(!hasQuantity(x))missing.push('Menge');return missing};
 window.MRInventory=Object.freeze({filled,hasQuantity,quantity,quantityLabel,kind,needsReorder,missingFields});
})();
