import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {countdownState} from '../src/utils/countdown.mjs';
import {safeExternal,withBase} from '../src/utils/url.ts';
const json=name=>JSON.parse(readFileSync(new URL(`../src/data/${name}.json`,import.meta.url),'utf8'));
const conference=json('conference');

test('countdown targets midnight in Bali, not the visitor time zone',()=>{
 const start=new Date(conference.start).getTime();
 assert.equal(new Date(start).toISOString(),'2027-11-15T16:00:00.000Z');
 assert.deepEqual(countdownState(start-90061000,conference.start,conference.end),{days:1,hours:1,minutes:1,seconds:1,status:'upcoming'});
});
test('countdown stops at start and distinguishes live and ended states',()=>{
 const start=new Date(conference.start).getTime();const end=new Date(conference.end).getTime();
 assert.deepEqual(countdownState(start,conference.start,conference.end),{days:0,hours:0,minutes:0,seconds:0,status:'live'});
 assert.equal(countdownState(end,conference.start,conference.end).status,'live');
 assert.equal(countdownState(end+1,conference.start,conference.end).status,'ended');
});
test('URLs work with project and apex deployments',()=>{
 for(const base of ['/apbiomech2027/','apbiomech2027','/apbiomech2027'])assert.equal(withBase('/abstracts/',base),'/apbiomech2027/abstracts/');
 assert.equal(withBase('images/branding/banner.png','/'),'/images/branding/banner.png');
 assert.equal(withBase('','/apbiomech2027/'),'/apbiomech2027/');
});
test('external actions accept only valid HTTPS destinations',()=>{
 for(const value of [null,undefined,'','javascript:alert(1)','http://example.com','/unconfirmed','not a url'])assert.equal(safeExternal(value),null);
 assert.equal(safeExternal('https://example.com/portal'),'https://example.com/portal');
});
test('approved data has the minimum fields needed for publication',()=>{
 for(const dataset of ['speakers','committee'])for(const row of json(dataset).filter(r=>r.approved)){
  for(const field of ['name','institution','country'])assert.ok(row[field],`${dataset}: ${field} required`);
  if(row.image)assert.ok(existsSync(`public/${row.image}`),`Missing ${row.image}`);
 }
 if(conference.submissionOpen)assert.ok(safeExternal(conference.cmtUrl),'Open submissions need an HTTPS portal');
 if(conference.registrationOpen)assert.ok(safeExternal(conference.registrationUrl),'Open registration needs an HTTPS portal');
 for(const logo of conference.logos)assert.ok(existsSync(`public/${logo.image}`),`Missing official logo ${logo.image}`);
 for(const photo of conference.baliPhotos){assert.ok(photo.alt&&photo.credit,'Destination photos need alt text and credit');assert.ok(existsSync(`public/${photo.image}`));}
 for(const sponsor of json('sponsors').filter(s=>s.approved)){assert.ok(sponsor.name&&sponsor.category);if(sponsor.image)assert.ok(existsSync(`public/${sponsor.image}`));}
 for(const key of ['abstractTemplate','programmeDownload','sponsorshipProspectus'])if(conference[key])assert.ok(existsSync(`public/${conference[key]}`),`Missing ${key}`);
});
test('programme data can be filtered and approved dates remain valid',()=>{
 const programme=json('programme');
 for(const entry of programme.entries.filter(e=>e.approved)){
  assert.ok(programme.days.includes(entry.date));assert.ok(/^\d{2}:\d{2}$/.test(entry.time));assert.ok(entry.id&&entry.title&&entry.type&&entry.topic);
 }
 for(const row of json('dates'))if(row.date)assert.ok(Number.isFinite(new Date(row.date).getTime()));
 const fees=json('registration');
 assert.equal(fees.planningCurrency,fees.benchmark.currency,'Display estimates in their supplied source currency');
 assert.ok(/^[A-Z]{3}$/.test(fees.planningCurrency),'Planning display currency must be an ISO code');
 for(const row of fees.categories)for(const field of ['earlyBird','regular'])if(row[field]!==null){assert.equal(typeof row[field],'number');assert.ok(row[field]>=0);assert.ok(fees.currency,'Fees require an approved currency');}
});

test('selected provisional timetable does not become approved deadlines or use conflicting drafts',()=>{
 const planning=json('planning');
 const dates=json('dates');
 assert.equal(planning.sourceDocument,'05-important-dates.md');assert.equal(planning.deadlineTimeZone,'Asia/Jakarta');
 for(const row of dates){assert.equal(row.date,null);if(row.estimatedDate)assert.ok(Number.isFinite(new Date(row.estimatedDate).getTime()));}
 for(const [id,date] of Object.entries({'registration-open':'2027-04-19','abstracts-close':'2027-05-23',acceptance:'2027-06-23','early-bird':'2027-07-28','author-registration':'2027-08-02'})){
  assert.equal(dates.find(row=>row.id===id).estimatedDate,date);
 }
 const programme=json('dates').find(row=>row.id==='programme');
 assert.equal(programme.estimatedDate,null,'Approximate programme milestone must not imply an exact day');
 assert.equal(programme.estimatedLabel,'Mid-August 2027');
});
test('new international estimates use USD while Indonesian fees remain unconfirmed',()=>{
 const fees=json('registration');
 assert.equal(fees.benchmark.currency,'USD');assert.equal(fees.currency,null);
 const full=fees.categories.find(row=>row.name==='International — Regular');
 const student=fees.categories.find(row=>row.name==='International — Student');
 assert.deepEqual([full.estimatedEarlyBird,full.estimatedRegular,student.estimatedEarlyBird,student.estimatedRegular],[500,600,300,350]);
 for(const row of fees.categories.filter(row=>row.name.startsWith('Indonesian')))assert.deepEqual([row.estimatedEarlyBird,row.estimatedRegular],[null,null]);
});
