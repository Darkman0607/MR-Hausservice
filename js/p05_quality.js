/* P05: knowledge, source-traceable dosage, contextual warnings, QA and follow-up.
   Pure module; caller persists all changes through existing application save(). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.MRP05Quality=api})(typeof globalThis!=='undefined'?globalThis:null,function(){'use strict';
const surfaceNames={Glas:'Glas',Fliesen:'Fliesen',Holz:'Holz',Naturstein:'Naturstein',Kunststoff:'Kunststoff'};
const guidance={
 Glas:{do:'Mit sauberem, weichem Tuch und für Glas freigegebenem Mittel arbeiten; Streifen und Beschichtungen prüfen.',avoid:'Keine kratzenden Pads oder Scheuermittel auf beschichtetem Glas verwenden.'},
 Fliesen:{do:'Fliesen- und Fugenmaterial getrennt auf Eignung prüfen; nach Herstellerangabe nachwischen.',avoid:'Säurehaltige Mittel nicht ungeprüft auf zementären Fugen oder empfindlichen Oberflächen einsetzen.'},
 Holz:{do:'Oberflächenbehandlung bestimmen; sparsam nebelfeucht reinigen und rasch trocknen.',avoid:'Kein stehendes Wasser, keine aggressiven Lösemittel und keine ungeprüften alkalischen Reiniger.'},
 Naturstein:{do:'Gesteinsart und Versiegelung bestimmen, bevorzugt freigegebene pH-neutrale Verfahren.',avoid:'Säure auf kalkhaltigem Naturstein (z. B. Marmor/Kalkstein) vermeiden.'},
 Kunststoff:{do:'An unauffälliger Stelle auf Verträglichkeit prüfen; schonend reinigen.',avoid:'Keine scheuernden Pads oder ungeprüfte Lösemittel verwenden.'}
};
const sourceNote='Allgemeine materialschonende Vorsichtsregeln (P05, keine produktspezifische Herstellerfreigabe). Maßgeblich sind Materialhersteller und Produktetikett.';
const qaItems=[['residue','Sichtbare Rückstände entfernt'],['result','Reinigungsergebnis überprüft'],['damage','Oberfläche auf Schäden kontrolliert'],['finish','Nacharbeit und offene Punkte geprüft']];
const flags=['chlorine','acid','ammonia','gloves','goggles','ventilate'];
function cleanText(value,max=350){return String(value??'').trim().slice(0,max)}
function normalizeInfo(raw){const x=raw&&typeof raw==='object'?raw:{};return {surfaces:Array.isArray(x.surfaces)?x.surfaces.filter(s=>guidance[s]):[],productType:cleanText(x.productType,80),dose:cleanText(x.dose,160),doseUnit:cleanText(x.doseUnit,100),usage:cleanText(x.usage,200),source:cleanText(x.source,500),sourceDate:cleanText(x.sourceDate,10),sourceChecked:x.sourceChecked===true,notes:cleanText(x.notes,1200),flags:flags.filter(f=>Array.isArray(x.flags)&&x.flags.includes(f)),updatedAt:cleanText(x.updatedAt,35)};}
function doseDisplay(raw){const x=normalizeInfo(raw);if(!x.dose)return{state:'missing',text:'Keine Hersteller-Dosierung hinterlegt. Keine Menge ableiten.'};if(!x.source||!x.sourceChecked)return{state:'unverified',text:'Dosierung nicht als Herstellerangabe bestätigt – nicht als Anwendungsempfehlung verwenden.'};return{state:'confirmed',text:`Laut manuell geprüfter Quelle: ${x.dose}${x.doseUnit?' '+x.doseUnit:''}${x.usage?' · '+x.usage:''} · Quelle: ${x.source}${x.sourceDate?' ('+x.sourceDate+')':''}`};}
function warnings(raw,surface=''){const x=normalizeInfo(raw),w=[];
 if(x.flags.includes('chlorine'))w.push('Chlorhaltiges Mittel: niemals mit Säuren oder ammoniakhaltigen Mitteln mischen; Gefahr giftiger Gase.');
 if(x.flags.includes('acid'))w.push('Säurehaltiges Mittel: niemals mit Chlorreinigern mischen; Materialverträglichkeit prüfen.');
 if(x.flags.includes('ammonia'))w.push('Ammoniakhaltiges Mittel: niemals mit Chlorreinigern mischen.');
 if(x.flags.includes('gloves'))w.push('Schutzhandschuhe laut Produktinformationen verwenden.');
 if(x.flags.includes('goggles'))w.push('Augenschutz laut Produktinformationen verwenden.');
 if(x.flags.includes('ventilate'))w.push('Für ausreichende Lüftung laut Produktinformationen sorgen.');
 if(surface==='Naturstein'&&x.flags.includes('acid'))w.push('Säurehaltiges Produkt nicht auf säureempfindlichem Naturstein verwenden.');
 if(surface&&x.surfaces.length&&!x.surfaces.includes(surface))w.push('Diese Oberfläche ist für das Produkt nicht als freigegeben eingetragen. Vor Verwendung Herstellerinformationen prüfen.');
 if(!x.sourceChecked||!x.source)w.push('Produktangaben nicht durch eine bestätigte Herstellerquelle belegt; Etikett/Sicherheitsdatenblatt prüfen.');
 return[...new Set(w)];}
function incompatible(items){const types=new Set(items.flatMap(x=>normalizeInfo(x).flags));const result=[];if(types.has('chlorine')&&types.has('acid'))result.push('ACHTUNG: Chlorreiniger und saure Reiniger dürfen niemals gemischt werden (giftiges Chlorgas).');if(types.has('chlorine')&&types.has('ammonia'))result.push('ACHTUNG: Chlorreiniger und ammoniakhaltige Mittel dürfen niemals gemischt werden (gefährliche Chloramine).');return result;}
function checks(session){return qaItems.map(([key,label])=>({key,label,checked:Boolean(session?.p05QA?.[key])}));}
function setCheck(session,key,value){if(!qaItems.some(i=>i[0]===key))throw Error('Unbekannte Qualitätsprüfung.');session.p05QA||={};session.p05QA[key]=Boolean(value);}
function defects(session){return Array.isArray(session?.p05Defects)?session.p05Defects:[];}
function addDefect(session,roomId,description,makeId,now){if(!session?.roomIds?.includes(roomId))throw Error('Raum gehört nicht zu dieser Reinigung.');const text=cleanText(description,600);if(text.length<4)throw Error('Mangel mindestens 4 Zeichen beschreiben.');session.p05Defects||=[];const defect={id:makeId(),roomId,description:text,status:'open',createdAt:now||new Date().toISOString(),resolvedAt:null,followUpTaskId:null};session.p05Defects.push(defect);return defect;}
function resolveDefect(session,defectId,done,now){const found=defects(session).find(x=>x.id===defectId);if(!found)throw Error('Mangel nicht gefunden.');found.status=done?'resolved':'open';found.resolvedAt=done?(now||new Date().toISOString()):null;return found;}
function followup(session,defectId,tasks,makeId,date){const d=defects(session).find(x=>x.id===defectId);if(!d)throw Error('Mangel nicht gefunden.');if(d.followUpTaskId){const old=tasks.find(x=>x.id===d.followUpTaskId);if(old)return old;throw Error('Verknüpfte Folgeaufgabe fehlt. Bitte zuerst Zuordnung prüfen.');}
 const t={id:makeId(),title:'Nacharbeit: '+d.description.slice(0,90),placeId:d.roomId,startDate:date,priority:'Hoch',note:'Nacharbeit zu Reinigung '+session.id+' / Mangel '+d.id+'\n'+d.description,schedule:{unit:'once',count:1,basis:'completion'},steps:[{id:makeId(),title:d.description,hint:'Mangel beheben und Ergebnis kontrollieren',required:true}],targetMinutes:0,materials:[],p05DefectId:d.id,p05SessionId:session.id};tasks.push(t);d.followUpTaskId=t.id;return t;}
return{guidance,surfaceNames,sourceNote,qaItems,flags,normalizeInfo,doseDisplay,warnings,incompatible,checks,setCheck,defects,addDefect,resolveDefect,followup};
});