import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RegistrationCore as core} from '../registration/core.mjs';
import {appsScriptHarness,syntheticSubmission,formEvent} from './helpers/apps-script-harness.mjs';

test('single-word names work; email matching and international phone validation are enforced',()=>{
  assert.equal(core.validate(syntheticSubmission(),'TEST').valid,true);
  const result=core.validate(syntheticSubmission({confirmEmail:'other@example.invalid',phone:'0812'}),'TEST');
  assert.ok(result.errors.confirmEmail);assert.ok(result.errors.phone);
});
test('student/presenter requirements apply only when relevant, with multiple optional CMT IDs',()=>{
  const input=syntheticSubmission({category:'Student participant',participation:'Presenting author'});
  const bad=core.validate(input,'TEST');
  for(const field of ['degree','studentStatus','presentation'])assert.ok(bad.errors[field]);
  assert.equal(core.validate({...input,degree:'PhD',studentStatus:'Full-time student',presentation:'Not yet confirmed',abstractIds:'123, 456;789'},'TEST').valid,true);
  assert.equal(core.validate({...input,degree:'PhD',studentStatus:'Part-time student',presentation:'Poster presentation',abstractIds:''},'TEST').valid,true);
  assert.equal(core.validate(syntheticSubmission({abstractIds:'<script>',degree:'stale'}),'TEST').data.abstractIds,'');
});
test('demo limits email to synthetic address and all modes require agreements',()=>{
  assert.equal(core.validate(syntheticSubmission(),'DEMO').valid,true);
  assert.ok(core.validate(syntheticSubmission({email:'person@real.test',confirmEmail:'person@real.test'}),'DEMO').errors.email);
  for(const field of ['privacy','terms','accuracy','synthetic'])assert.ok(core.validate(syntheticSubmission({[field]:''}),'TEST').errors[field]);
  assert.ok(core.validate(syntheticSubmission({comments:'x'.repeat(1001)}),'TEST').errors.comments);
});
test('spreadsheet injection and acknowledgment HTML are escaped',()=>{
  for(const value of ['=IMPORTXML("x")','+62812','-1','@SUM(A1)',' \t=1','\nformula'])assert.ok(core.safeCell(value).startsWith("'"));
  assert.equal(core.escapeHtml('<img onerror="x">'),'&lt;img onerror=&quot;x&quot;&gt;');
  const h=appsScriptHarness();
  const input=syntheticSubmission({institution:'=IMPORTXML("x")'});
  h.context.processRegistration_(formEvent(input));
  assert.equal(h.rows[1][7],"'=IMPORTXML(\"x\")");
});
test('server validates independently, rejects polluted/oversized/bot submissions without writing',()=>{
  const h=appsScriptHarness();
  assert.equal(h.context.processRegistration_(formEvent(syntheticSubmission({email:'bad'}))).code,'VALIDATION');
  for(const input of [syntheticSubmission({website:'spam'}),syntheticSubmission({startedAt:String(Date.now())}),syntheticSubmission({unexpected:'value'}),syntheticSubmission({consentVersion:'wrong'})])assert.throws(()=>h.context.processRegistration_(formEvent(input)));
  const repeated=formEvent(syntheticSubmission());repeated.parameters.email.push('another@example.invalid');
  assert.throws(()=>h.context.processRegistration_(repeated),/INVALID_REQUEST/);
  const large=formEvent(syntheticSubmission());large.postData.length=20001;assert.throws(()=>h.context.processRegistration_(large));
  assert.equal(h.rows.length,1);assert.equal(h.sent.length,0);
});
test('default DEMO and unapproved LIVE fail closed; TEST uses an explicit recipient allowlist',()=>{
  for(const properties of [{REGISTRATION_MODE:'DEMO'},{REGISTRATION_MODE:'LIVE',LIVE_SPREADSHEET_ID:'live-database'},{TEST_EMAIL_ALLOWLIST:''}]){
    const h=appsScriptHarness(properties);assert.throws(()=>h.context.processRegistration_(formEvent(syntheticSubmission())));assert.equal(h.rows.length,1);
  }
});
test('ID reservation, row write, same-key retry, email duplication, and changed retry are coordinated',()=>{
  const h=appsScriptHarness(), input=syntheticSubmission();
  const first=h.context.processRegistration_(formEvent(input));
  assert.equal(first.receipt.id,'APB2027-0001');assert.equal(h.sent.length,1);assert.equal(h.rows.length,2);
  const retry=h.context.processRegistration_(formEvent(input));
  assert.equal(retry.receipt.id,first.receipt.id);assert.equal(retry.receipt.duplicate,true);assert.equal(h.sent.length,1);assert.equal(h.rows.length,2);
  assert.throws(()=>h.context.processRegistration_(formEvent({...input,institution:'Changed'})),/RETRY_CHANGED/);
  assert.throws(()=>h.context.processRegistration_(formEvent(syntheticSubmission())),/ALREADY_RECEIVED/);
});
test('sequential reservations never reuse an ID after property reset; busy lock cannot write',()=>{
  const h=appsScriptHarness({TEST_EMAIL_ALLOWLIST:'one@example.invalid,two@example.invalid'});
  const first=h.context.processRegistration_(formEvent(syntheticSubmission({email:'one@example.invalid',confirmEmail:'one@example.invalid'})));
  delete h.properties.REGISTRATION_COUNTER_TEST;
  const second=h.context.processRegistration_(formEvent(syntheticSubmission({email:'two@example.invalid',confirmEmail:'two@example.invalid'})));
  assert.equal(first.receipt.id,'APB2027-0001');assert.equal(second.receipt.id,'APB2027-0002');
  const busy=appsScriptHarness();busy.forceBusy();assert.throws(()=>busy.context.processRegistration_(formEvent(syntheticSubmission())),/BUSY/);assert.equal(busy.rows.length,1);
});
test('formula-like email addresses still deduplicate after spreadsheet escaping',()=>{
  const h=appsScriptHarness({TEST_EMAIL_ALLOWLIST:'+demo@example.invalid'});
  const input=syntheticSubmission({email:'+demo@example.invalid',confirmEmail:'+demo@example.invalid'});
  h.context.processRegistration_(formEvent(input));
  assert.throws(()=>h.context.processRegistration_(formEvent({...input,submissionKey:syntheticSubmission().submissionKey})),/ALREADY_RECEIVED/);
});
test('rate limits stop extra rows; email failure/quota preserve receipt and never auto-resend',()=>{
  const h=appsScriptHarness({MAX_ACCEPTED_PER_MINUTE:'1',TEST_EMAIL_ALLOWLIST:'one@example.invalid,two@example.invalid'});
  h.context.processRegistration_(formEvent(syntheticSubmission({email:'one@example.invalid',confirmEmail:'one@example.invalid'})));
  assert.throws(()=>h.context.processRegistration_(formEvent(syntheticSubmission({email:'two@example.invalid',confirmEmail:'two@example.invalid'}))),/RATE_LIMIT/);
  for(const kind of ['failure','quota']){
    const mail=appsScriptHarness();if(kind==='failure')mail.failMail();else mail.setQuota(0);
    const input=syntheticSubmission(), result=mail.context.processRegistration_(formEvent(input));
    assert.equal(result.ok,true);assert.equal(mail.rows.length,2);assert.equal(result.receipt.emailStatus,kind==='failure'?'FAILED':'QUOTA_EXCEEDED');
    mail.context.processRegistration_(formEvent(input));assert.equal(mail.sent.length,0);
  }
});
test('new records have no fee/payment reference; confirmation and attendance are not implied',()=>{
  const h=appsScriptHarness();h.context.processRegistration_(formEvent(syntheticSubmission()));
  const col=name=>h.context.REGISTRATION_HEADERS.indexOf(name);
  for(const name of ['Registration fee','Currency','Payment reference'])assert.equal(h.rows[1][col(name)],'');
  assert.equal(h.rows[1][col('Payment status')],'NOT_REQUESTED');assert.equal(h.rows[1][col('Registration status')],'RECEIVED');
  assert.equal(h.context.paymentIntegrationState_().enabled,false);
});
test('database initialization expands a blank Sheet and preserves existing rows on repeat',()=>{
  const h=appsScriptHarness();h.rows.length=0;
  h.context.initializeRegistrationDatabase_();assert.equal(h.rows[0].length,37);
  h.context.processRegistration_(formEvent(syntheticSubmission()));
  const saved=JSON.stringify(h.rows);h.context.initializeRegistrationDatabase_();assert.equal(JSON.stringify(h.rows),saved);
});
test('response HTML escapes category and logs exclude participant contents',()=>{
  const h=appsScriptHarness(), response=h.context.doPost(formEvent(syntheticSubmission()));
  assert.ok(response.html.includes('APB2027-0001'));assert.ok(response.html.includes('does not constitute final confirmation'));
  assert.ok(!h.logs.join('').includes('demo.participant'));
  const crafted=h.context.registrationResponse_({ok:true,mode:'TEST',receipt:{id:'<script>',category:'<img>',emailStatus:'SENT'}});
  assert.ok(crafted.html.includes('&lt;script&gt;'));assert.ok(!crafted.html.includes('<img>'));
});
test('generated Apps Script core matches frontend core and configured activation is guarded',()=>{
  const config=JSON.parse(readFileSync('src/data/registration-system.json','utf8'));
  assert.ok(['DEMO','TEST','LIVE'].includes(config.mode));
  if(config.mode==='DEMO'){assert.equal(config.endpoint,'');assert.equal(config.privacyApproved,false);}
  else assert.match(config.endpoint,/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/);
  if(config.mode==='LIVE'){assert.equal(config.privacyApproved,true);assert.ok(config.committeeAuthorization);assert.ok(!config.consentVersion.endsWith('-draft'));}
  assert.equal(readFileSync('backend/google-apps-script/Core.gs','utf8').split('\n').slice(1).join('\n'),readFileSync('registration/core.mjs','utf8').replace('export {RegistrationCore};','').trimEnd()+'\n');
});
