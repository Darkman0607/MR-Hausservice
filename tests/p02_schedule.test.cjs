'use strict';const assert=require('node:assert/strict'),e=require('../js/p02_schedule.js');let tests=0;function test(title,fn){fn();tests++;console.log('OK',tests,title)}
const t=(start,unit,count=1,basis='fixed',more={})=>({id:'1',startDate:start,schedule:{unit,count,basis,...more}});
test('calendar math leap month',()=>{assert.equal(e.plusMonths('2028-01-31',1),'2028-02-29');assert.equal(e.plusMonths('2026-01-31',1),'2026-02-28')});
test('daily cadence',()=>assert.deepEqual(e.raw(t('2026-10-24','days',2),'2026-10-24','2026-11-01'),['2026-10-24','2026-10-26','2026-10-28','2026-10-30','2026-11-01']));
test('weekly cadence',()=>assert.deepEqual(e.raw(t('2026-10-24','weeks',2),'2026-10-24','2026-11-23'),['2026-10-24','2026-11-07','2026-11-21']));
test('monthly capped days',()=>assert.deepEqual(e.raw(t('2026-01-31','months',1),'2026-02-01','2026-04-30'),['2026-02-28','2026-03-31','2026-04-30']));
test('weekday cadence',()=>assert.deepEqual(e.raw(t('2026-10-19','weekdays',1,'fixed',{weekdays:[1,3,5]}),'2026-10-19','2026-10-26'),['2026-10-19','2026-10-21','2026-10-23','2026-10-26']));
test('seasonal cadence',()=>assert.deepEqual(e.raw(t('2026-01-31','seasonal',1,'fixed',{months:[3,9]}),'2026-01-01','2026-12-31'),['2026-03-31','2026-09-30']));
test('once and done',()=>assert.equal(e.next({...t('2026-10-24','once'),completedAt:'2026-10-24T11:00:00Z'}),null));
test('legacy task defaults to completion',()=>assert.equal(e.next(t('2026-10-24','weeks',1,'completion')).date,'2026-10-24'));
test('repeat following completion',()=>{let x={...t('2026-10-24','weeks',1,'completion'),completedAt:'2026-10-25T08:00:00Z',completedDate:'2026-10-25'};assert.equal(e.next(x).date,'2026-11-01');assert.equal(e.eventsBetween(x,'2026-10-24','2026-10-31').length,0)});
test('fixed repeat after completion',()=>{let x={...t('2026-10-24','weeks'),completedAt:'2026-10-25T08:00:00Z',completedDate:'2026-10-25'};assert.equal(e.next(x).date,'2026-10-31')});
test('skip only a single weekly date',()=>{let x={...t('2026-10-24','weeks'),exceptions:[{date:'2026-10-24',action:'skip',reason:'Ferien'}]};assert.equal(e.next(x).date,'2026-10-31');assert.deepEqual(e.eventsBetween(x,'2026-10-24','2026-10-31').map(v=>v.date),['2026-10-31'])});
test('move only one date, no duplicate',()=>{let x={...t('2026-10-24','weeks'),exceptions:[{date:'2026-10-24',action:'move',targetDate:'2026-10-27'}]};assert.equal(e.next(x).date,'2026-10-27');assert.deepEqual(e.eventsBetween(x,'2026-10-24','2026-11-01').map(v=>v.date),['2026-10-27','2026-10-31'])});
test('catch-up skipped date',()=>{let x={...t('2026-10-24','weeks'),exceptions:[{date:'2026-10-24',action:'catchup',targetDate:'2026-10-29'}]};assert.equal(e.next(x).date,'2026-10-29')});
test('moving onto regular date deduplicates',()=>{let x={...t('2026-10-24','days'),exceptions:[{date:'2026-10-24',action:'move',targetDate:'2026-10-25'}]};assert.equal(e.eventsBetween(x,'2026-10-25','2026-10-25').length,1)});
test('separate privacy untouched',()=>{let h={personal:{household:{tasks:[t('2026-10-24','weeks')] }},work:[{id:3}]};JSON.stringify(e.eventsBetween(h.personal.household.tasks[0],'2026-10-24','2026-10-31'));assert.equal(h.work.length,1)});
test('suggestion insufficient evidence',()=>assert.equal(e.suggest({completions:[{at:'2026-10-03'},{at:'2026-10-10'}]}),null));
test('suggestion from sessions',()=>{const x=e.suggest({completions:['2026-10-03','2026-10-10','2026-10-17','2026-10-24'].map(at=>({at:at+'T10:00:00Z'}))});assert.equal(x.days,7);assert.equal(x.unit,'weeks');assert.equal(x.count,1);assert.equal(x.records,4)});
test('duplicate completion same day does not distort suggestion',()=>{let x=e.suggest({completions:['2026-10-03','2026-10-03','2026-10-10','2026-10-17'].map(at=>({at:at+'T10:00:00Z'}))});assert.equal(x.days,7)});
test('invalid date rejects silent overflow',()=>{assert.equal(e.validDate('2026-02-31'),false);assert.equal(e.validDate('2026-10-24'),true)});
console.log(`${tests} P02 unit tests passed`)
