function registrationConfig_() {
  var p=PropertiesService.getScriptProperties(), mode=p.getProperty('REGISTRATION_MODE')||'DEMO';
  var positive=function(key,fallback,max){var n=Number(p.getProperty(key)||fallback);if(!Number.isInteger(n)||n<1||n>max)throw new Error('CONFIGURATION');return n;};
  return {mode:mode,spreadsheetId:p.getProperty(mode==='LIVE'?'LIVE_SPREADSHEET_ID':'TEST_SPREADSHEET_ID')||'',
    testSpreadsheetId:p.getProperty('TEST_SPREADSHEET_ID')||'',
    liveAuthorized:p.getProperty('LIVE_AUTHORIZATION')||'',privacyApproved:p.getProperty('PRIVACY_APPROVED')==='true',
    consentVersion:p.getProperty('CONSENT_VERSION')||'2026-11-25-draft',
    emailEnabled:p.getProperty('ACK_EMAIL_ENABLED')==='true',replyTo:p.getProperty('ACK_REPLY_TO')||'',
    testEmails:(p.getProperty('TEST_EMAIL_ALLOWLIST')||'').split(',').map(function(s){return s.trim().toLowerCase();}).filter(Boolean),
    maxPerMinute:positive('MAX_ACCEPTED_PER_MINUTE',10,100),maxPerDay:positive('MAX_ACCEPTED_PER_DAY',100,2000)};
}
function processRegistration_(event) {
  var config=registrationConfig_();
  if (config.mode==='DEMO') throw new Error('DEMO_DISABLED');
  if (!['TEST','LIVE'].includes(config.mode) || !config.spreadsheetId) throw new Error('CONFIGURATION');
  if (config.mode==='LIVE' && (!config.liveAuthorized || !config.privacyApproved || config.consentVersion.endsWith('-draft') || !config.testSpreadsheetId || config.spreadsheetId===config.testSpreadsheetId)) throw new Error('LIVE_NOT_AUTHORIZED');
  if (!event || !event.postData || event.postData.length>20000 || !/^application\/x-www-form-urlencoded(?:;|$)/i.test(event.postData.type)) throw new Error('INVALID_REQUEST');
  var input=event.parameter||{}, parameters=event.parameters||{};
  if (Object.keys(input).some(function(key){return !Object.prototype.hasOwnProperty.call(RegistrationCore.limits,key);}) || Object.keys(parameters).some(function(key){return parameters[key].length!==1;})) throw new Error('INVALID_REQUEST');
  if (input.mode!==config.mode || input.consentVersion!==config.consentVersion) throw new Error('VERSION_MISMATCH');
  if (input.website || !/^[a-f0-9-]{36}$/i.test(input.submissionKey||'')) throw new Error('INVALID_REQUEST');
  var elapsed=Date.now()-Number(input.startedAt);
  if (!Number.isFinite(elapsed)||elapsed<3000||elapsed>86400000) throw new Error('FORM_EXPIRED');
  var checked=RegistrationCore.validate(input,config.mode);
  if (!checked.valid) return {ok:false,code:'VALIDATION',errors:checked.errors};
  var data=checked.data;data.email=data.email.toLowerCase();
  if (config.mode==='TEST' && !config.testEmails.includes(data.email)) throw new Error('TEST_EMAIL_NOT_ALLOWED');
  var receipt=acceptRegistration_(data,config);
  receipt.emailStatus=sendAcknowledgment_(data,receipt,config);
  return {ok:true,receipt:receipt,mode:config.mode};
}
function doGet() {return registrationResponse_({ok:false,code:'POST_REQUIRED'});}
function doPost(event) {
  var requestId=Utilities.getUuid(), result;
  try { result=processRegistration_(event); }
  catch (error) {
    var codes=['BUSY','CONFIGURATION','SCHEMA_MISMATCH','RETRY_CHANGED','ALREADY_RECEIVED','RATE_LIMIT','DAILY_LIMIT','DEMO_DISABLED','LIVE_NOT_AUTHORIZED','INVALID_REQUEST','VERSION_MISMATCH','FORM_EXPIRED','TEST_EMAIL_NOT_ALLOWED'];
    result={ok:false,code:codes.includes(error.message)?error.message:'TEMPORARY_ERROR'};
  }
  // Never log request payloads, names, emails, IDs, headers, or exception stacks.
  console.log(JSON.stringify({request:requestId,outcome:result.ok?'RECEIVED':result.code}));
  return registrationResponse_(result);
}
function registrationResponse_(result) {
  var escape=RegistrationCore.escapeHtml;
  var messages={
    POST_REQUIRED:'Return to the conference registration form to send your details.',
    DEMO_DISABLED:'This backend is in DEMO mode. No information has been saved.',
    BUSY:'The registration service is busy. Return to the original tab and retry the same submission.',
    ALREADY_RECEIVED:'A registration for this email address has already been received. No new record was created. Contact the committee for changes.',
    RETRY_CHANGED:'This submission reference was used with different details. Check the original acknowledgment; contact the committee for corrections.',
    RATE_LIMIT:'The service is receiving many registrations. Wait a minute and retry from the original tab.',
    DAILY_LIMIT:'Registration is temporarily paused. Please try later.',
    FORM_EXPIRED:'The form was submitted too quickly or has expired. Return to the original tab, wait a few seconds, or reload an expired form.',
    VERSION_MISMATCH:'The form or mode has changed. Keep a copy of your entries and reload the conference form.',
    TEST_EMAIL_NOT_ALLOWED:'This test service accepts only approved synthetic-test email addresses.'
  };
  var body;
  if (result.ok) {
    body='<h1>'+(result.mode==='TEST'?'Synthetic test registration received':'Registration received')+'</h1><p>Registration ID: <strong>'+escape(result.receipt.id)+'</strong></p><p>Category: '+escape(result.receipt.category)+'</p><p>'+(result.receipt.duplicate?'The original receipt is shown. No duplicate record or email was created.':'Your registration information has been received.')+'</p><p>Payment status: '+escape(paymentStatusLabel_(result.receipt.paymentStatus))+'. No payment is requested at this stage.</p><p>Acknowledgment email status: '+escape(result.receipt.emailStatus)+'. SENT means the mail service accepted the message; check your inbox and spam folder.</p><p>Registration fees and payment arrangements will be announced once confirmed by the organizing committee.</p><p><strong>This acknowledgment does not constitute final confirmation of conference participation.</strong></p>';
  } else {
    body='<h1>Registration could not be completed</h1><p>'+escape(messages[result.code]||'The service could not complete this request. Your entries remain in the original tab. Retry using the same submission reference; contact the committee if the error persists.')+'</p>';
    if (result.errors) body+='<ul>'+Object.keys(result.errors).map(function(key){return '<li>'+escape(key)+': '+escape(result.errors[key])+'</li>';}).join('')+'</ul>';
    body+='<p>Response code: '+escape(result.code)+'</p>';
  }
  var html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>14th APBiomech registration response</title><style>body{font:18px/1.8 Arial,sans-serif;color:#12334f;background:#f1f6fa;margin:0;padding:24px}main{max-width:760px;margin:30px auto;background:white;padding:32px;border-top:5px solid #009bc1}h1{font-size:28px;line-height:1.3}strong{overflow-wrap:anywhere}</style></head><body><main><p>14th APBiomech · November 16–19, 2027 · Bali, Indonesia</p>'+body+'<p>You can return to the original conference tab. Do not refresh or resubmit this response page.</p></main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('14th APBiomech registration response').addMetaTag('viewport','width=device-width, initial-scale=1');
}
