// Manual synthetic test only. Sends ONE test email if ACK_EMAIL_ENABLED=true.
// Run from the Apps Script editor after configuring TEST_EMAIL_ALLOWLIST.
function runSyntheticSmokeTest_() {
  var config=registrationConfig_();
  if(config.mode!=='TEST'||!config.testEmails.length)throw new Error('Configure TEST mode and an approved test recipient first.');
  var email=config.testEmails[0];
  var input={title:'Dr',givenName:'Demo Participant',familyName:'',email:email,confirmEmail:email,
    phone:'+62 812 0000 0000',institution:'Example University (synthetic)',department:'Example Department',
    country:'Indonesia',position:'Researcher',category:'Regular participant',membership:'Non-member',
    participation:'Non-presenting participant',invitation:'No',workshop:'Undecided',
    privacy:'yes',terms:'yes',accuracy:'yes',synthetic:'yes',mode:'TEST',consentVersion:config.consentVersion,
    submissionKey:Utilities.getUuid(),startedAt:String(Date.now()-10000),website:''};
  var parameters={};Object.keys(input).forEach(function(key){parameters[key]=[input[key]];});
  var contents=Object.keys(input).map(function(key){return encodeURIComponent(key)+'='+encodeURIComponent(input[key]);}).join('&');
  var event={parameter:input,parameters:parameters,postData:{type:'application/x-www-form-urlencoded',length:contents.length,contents:contents}};
  var first=processRegistration_(event),retry=processRegistration_(event);
  if(!first.ok||!retry.ok||first.receipt.id!==retry.receipt.id||!retry.receipt.duplicate)throw new Error('Synthetic smoke test failed. Inspect test database privately.');
  console.log(JSON.stringify({test:'synthetic-smoke',passed:true,emailStatus:first.receipt.emailStatus}));
  // Deliberately no record contents or email addresses in the log.
}
