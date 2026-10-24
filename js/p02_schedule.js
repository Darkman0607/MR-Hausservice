/* M.R Hauservice P02 · pure date and scheduling calculations, no network or storage.
   Existing household task data is read without migration; revisions are opt-in. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.MRP02Schedule=api})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const rx=/^\d{4}-\d{2}-\d{2}$/;
function validDate(s){if(typeof s!=='string'||!rx.test(s))return false;let d=new Date(s+'T12:00:00Z');return !isNaN(+d)&&iso(d)===s}
function iso(d){return d.toISOString().slice(0,10)}
function stamp(s){return Date.parse(s+'T12:00:00Z')}
function plusDays(s,n){return iso(new Date(stamp(s)+Number(n)*86400000))}
function plusMonths(s,n){const d=new Date(stamp(s)),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+n);const max=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,max));return iso(d)}
function anchorMonth(s,offset){const d=new Date(stamp(s));return plusMonths(s,offset)}
function days(a,b){return Math.round((stamp(b)-stamp(a))/86400000)}
function monday(s){return plusDays(s,-(new Date(stamp(s)).getUTCDay()+6)%7)}
function normalized(t){const s=t&&t.schedule||{};return {unit:['once','days','weeks','months','weekdays','seasonal'].includes(s.unit)?s.unit:'weeks',count:Math.max(1,Math.min(999,Math.floor(Number(s.count)||1))),basis:s.basis==='fixed'?'fixed':'completion',weekdays:Array.from(new Set((Array.isArray(s.weekdays)?s.weekdays:[]).map(Number).filter(x=>x>=1&&x<=7))).sort((a,b)=>a-b),months:Array.from(new Set((Array.isArray(s.months)?s.months:[]).map(Number).filter(x=>x>=1&&x<=12))).sort((a,b)=>a-b)}}
function beginning(t){return validDate(t?.startDate)?t.startDate:(validDate(t?.createdAt?.slice(0,10))?t.createdAt.slice(0,10):iso(new Date()))}
function activeBase(t){const s=normalized(t),a=beginning(t);if(s.unit==='once'&&t.completedAt)return null;
 const c=validDate(t?.completedDate)?t.completedDate:(validDate(t?.completedAt?.slice(0,10))?t.completedAt.slice(0,10):null);
 if(s.basis==='fixed')return c?plusDays(c,1):a;
 if(!c)return validDate(t?.nextDueOverride)?t.nextDueOverride:a;
 if(validDate(t?.nextDueOverride))return t.nextDueOverride;
 // Legacy plans start each interval after the most recent completion.
 if(s.unit==='days')return plusDays(c,s.count);
 if(s.unit==='weeks')return plusDays(c,s.count*7);
 if(s.unit==='months')return plusMonths(c,s.count);
 return plusDays(c,1);
}
function raw(t,from,to,limit=1500){if(!validDate(from)||!validDate(to)||to<from)return [];const s=normalized(t),a=beginning(t),start=from<a?a:from,results=[];if(s.unit==='once'){if(!t.completedAt&&a>=from&&a<=to)results.push(a);return results}
 if(s.basis==='completion'){
  const base=activeBase(t);if(base===null)return [];
  if(['days','weeks','months'].includes(s.unit))return base>=from&&base<=to?[base]:[];
  if(s.unit==='weekdays'){for(let d=start<base?base:start,count=0;d<=to&&count++<3660;d=plusDays(d,1)){const dow=(new Date(stamp(d)).getUTCDay()+6)%7+1;if(s.weekdays.includes(dow)||(!s.weekdays.length&&dow===1))return [d]}return []}
  if(s.unit==='seasonal'){for(let d=start<base?base:start,count=0;d<=to&&count++<3660;d=plusDays(d,1)){const mon=Number(d.slice(5,7));if((s.months.length?s.months:[3,6,9,12]).includes(mon)&&Number(d.slice(8))===Math.min(Number(a.slice(8)),new Date(Date.UTC(Number(d.slice(0,4)),mon,0)).getUTCDate()))return [d]}return []}
 }
 if(s.unit==='days'||s.unit==='weeks'){
  const step=s.count*(s.unit==='weeks'?7:1);let k=Math.max(0,Math.ceil(days(a,start)/step));for(let i=0;i<limit;i++,k++){const d=plusDays(a,k*step);if(d>to)break;results.push(d)}
 }else if(s.unit==='months'){
  let k=Math.max(0,Math.floor((Number(start.slice(0,4))-Number(a.slice(0,4)))*12+(Number(start.slice(5,7))-Number(a.slice(5,7)))));k=Math.max(0,Math.floor(k/s.count)*s.count);for(let i=0;i<limit;i++,k+=s.count){const d=anchorMonth(a,k);if(d>to)break;if(d>=start)results.push(d)}
 }else if(s.unit==='weekdays'){
  const baseMonday=monday(a);for(let d=start,count=0;d<=to&&count++<3660&&results.length<limit;d=plusDays(d,1)){
   const weekNum=Math.floor(days(baseMonday,d)/7),dow=(new Date(stamp(d)).getUTCDay()+6)%7+1;
   if(weekNum%s.count===0&&(s.weekdays.length?s.weekdays:[1]).includes(dow))results.push(d)}
 }else if(s.unit==='seasonal'){
  let year=Number(start.slice(0,4)),end=Number(to.slice(0,4));for(;year<=end&&results.length<limit;year++)for(const month of (s.months.length?s.months:[3,6,9,12])){
    const day=Math.min(Number(a.slice(8)),new Date(Date.UTC(year,month,0)).getUTCDate());const d=year+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0');
    if(d>=start&&d<=to)results.push(d)}
 }
 return results.sort();}
function eventsBetween(t,from,to){if(!t||!validDate(from)||!validDate(to)||from>to)return [];
 const s=normalized(t),exceptions=Array.isArray(t.exceptions)?t.exceptions:[],override=new Map(exceptions.filter(x=>validDate(x.date)).map(x=>[x.date,x]));
 const slots=raw(t,from,to);const items=[];
 for(const nominal of slots){const ex=override.get(nominal);if(ex?.action==='skip'||ex?.action==='catchup'||ex?.action==='completed')continue;if(ex?.action==='move')continue;items.push({date:nominal,originalDate:nominal,shifted:false})}
 // Moves and catch-ups must render even if the original occurrence is outside the viewed range.
 const eligible=exceptions.some(x=>['move','catchup'].includes(x.action))?raw(t,beginning(t),exceptions.reduce((latest,x)=>validDate(x.date)&&x.date>latest?x.date:latest,to),3660):[];
 for(const ex of exceptions){if(!['move','catchup'].includes(ex.action)||ex.resolvedAt||!validDate(ex.targetDate)||ex.targetDate<from||ex.targetDate>to)continue;
  if(ex.date<beginning(t)||!eligible.includes(ex.date))continue;
  items.push({date:ex.targetDate,originalDate:ex.date,shifted:true,reason:ex.reason||''})}
 const seen=new Set();return items.sort((a,b)=>a.date.localeCompare(b.date)||a.originalDate.localeCompare(b.originalDate)).filter(x=>{const key=x.date;if(seen.has(key))return false;seen.add(key);return true});
}
function next(t){if(!t)return null;const base=activeBase(t);if(!base)return null;
 // With a fixed cadence an older planned occurrence may remain overdue; cap projection at 4 years.
 const earlier=(Array.isArray(t.exceptions)?t.exceptions:[]).filter(x=>['move','catchup'].includes(x.action)&&!x.resolvedAt&&validDate(x.targetDate)).map(x=>x.targetDate);const from=[base,...earlier].sort()[0];
 const end=plusDays(base,1460);const events=eventsBetween(t,from,end);return events.length?events[0]:null;
}
function suggest(t){const done=(Array.isArray(t?.completions)?t.completions:[]).map(x=>x?.at?.slice(0,10)).filter(validDate).sort();
 const unique=Array.from(new Set(done));if(unique.length<3)return null;
 const gaps=[];for(let i=1;i<unique.length;i++){const d=days(unique[i-1],unique[i]);if(d>0&&d<=365)gaps.push(d)}
 if(gaps.length<2)return null;gaps.sort((a,b)=>a-b);const md=Math.round(gaps.length%2?gaps[(gaps.length-1)/2]:(gaps[gaps.length/2-1]+gaps[gaps.length/2])/2);
 // Tell the user how the evidence is derived; never silently rewrite intervals.
 const evenly=gaps.every(x=>Math.abs(x-md)<=Math.max(1,Math.floor(md*.25)));
 return {unit:md%7===0?'weeks':'days',count:md%7===0?md/7:md,days:md,records:unique.length,intervals:gaps.length,stable:evenly};
}
return {validDate,plusDays,plusMonths,days,normalized,raw,eventsBetween,next,suggest};
});
