'use strict';const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const prompts=[],alerts=[];const db={work:[{id:'commercial-untouched',title:'Test Gewerbe'}],personal:{household:{places:[{id:'room',name:'Küche',type:'Raum',parentId:''}],tasks:[{id:'test',title:'Küche putzen',placeId:'room',startDate:'2026-10-24',priority:'Hoch',schedule:{unit:'weeks',count:1,basis:'fixed'},completions:[],materials:[]}],supplies:[],devices:[],sessions:[],active:null,floorplan:[{id:'old-drawing',roomId:'room',points:[[2,2],[20,2],[20,20]]}]}}};
const ctx={MRP02Schedule:require('../js/p02_schedule.js'),db,storage:null,settings:{},setInterval:()=>0,uid:()=>Math.random().toString(16),document:{addEventListener:()=>{}},window:{},esc:s=>String(s).replace(/</g,'&lt;'),euro:n=>String(n),today:()=>'2026-10-24',render:()=>{},goto:()=>{},save:async()=>true,saveSettings:()=>{},alert:s=>alerts.push(s),prompt:()=>prompts.shift(),confirm:()=>true,structuredClone,Date,Intl,console};
ctx.globalThis=ctx;
const source=fs.readFileSync(__dirname+'/../js/private1980.js','utf8').replace('window.MR_PRIVATE_BUILD=VERSION;',`window.__testHooks={action,p02UpdateException,p02CalendarEvents,p02AlertPanel,p02TaskStatus,completeSession,state,tasksPanel,due};window.MR_PRIVATE_BUILD=VERSION;`);
vm.runInNewContext(source,ctx,{filename:'js/private1980.js'});ctx.storage={};
const h=ctx.window.__testHooks;
function assertOriginals(){assert.equal(db.work[0].id,'commercial-untouched');assert.equal(db.personal.household.floorplan[0].id,'old-drawing');assert.equal(db.personal.household.places[0].id,'room')}
async function main(){
 assert.equal(h.due(db.personal.household.tasks[0]),'2026-10-24');assert.equal(h.p02CalendarEvents('2026-10-24').length,1);
 prompts.push('2026-10-26','Krankenstand');await h.action('p02-move','test');
 assert.equal(h.due(db.personal.household.tasks[0]),'2026-10-26');assert.equal(h.p02CalendarEvents('2026-10-24').length,0);assert.equal(h.p02CalendarEvents('2026-10-26').length,1);
 assert.equal(db.personal.household.tasks[0].history[0].date,'2026-10-24');
 prompts.push('Urlaub');await h.action('p02-skip','test');
 assert.equal(h.due(db.personal.household.tasks[0]),'2026-10-31');
 assert.equal(db.personal.household.tasks[0].history[1].date,'2026-10-24');
 prompts.push('2026-10-29');await h.action('p02-catchup','test|2026-10-24');
 assert.equal(h.due(db.personal.household.tasks[0]),'2026-10-29');assert.equal(h.p02CalendarEvents('2026-10-29').length,1);
 const t=db.personal.household.tasks[0];t.completions=['2026-10-03','2026-10-10','2026-10-17','2026-10-24'].map(x=>({at:x+'T12:00:00Z'}));
 assert.ok(h.tasksPanel().includes('Intervallvorschlag'));await h.action('p02-accept-suggest','test');assert.equal(t.schedule.count,1);assert.equal(t.schedule.unit,'weeks');assert.equal(t.schedule.basis,'completion');assert.equal(t.history.length,4);
 // Fixed-repeat completion must acknowledge the completed planned date and remove it from overdue counts.
 t.schedule.basis='fixed';db.personal.household.active={id:'session-1',roomId:'room',roomIds:['room'],completedTaskIds:['test'],materials:[],runningSince:null,baseMs:420000,roomMs:{room:420000},startedAt:'2026-10-24T10:00:00Z',beforePhotos:[],afterPhotos:[],note:''};
 await h.completeSession();assert.equal(db.personal.household.sessions.length,1);assert.equal(t.completions.length,5);assert.ok(t.exceptions.some(x=>x.action==='completed'));
 assert.ok(!h.p02AlertPanel().includes('Küche putzen'));
 assertOriginals();console.log('7 action/integration checks passed – move, skip, catchup, suggestion, completion, dashboard, legacy data');
}
main().catch(e=>{console.error(e);process.exitCode=1});
