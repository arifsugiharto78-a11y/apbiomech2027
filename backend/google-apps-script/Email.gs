function acknowledgmentEmail_(data,receipt,mode) {
  var name=[data.givenName,data.familyName].filter(Boolean).join(' ');
  return {
    subject:(mode==='TEST'?'[SYNTHETIC TEST] ':'')+'14th APBiomech — Registration Received',
    body:'Dear '+name+',\n\nThank you for registering your interest in attending the 14th Asian-Pacific Conference on Biomechanics (14th APBiomech), which will be held in Bali, Indonesia, on November 16–19, 2027.\n\nYour registration information has been successfully received.\n\nRegistration ID: '+receipt.id+'\nRegistration category: '+data.category+'\n\nInformation regarding registration fees and payment procedures will be provided separately once confirmed by the organizing committee.\n\nPlease note that this acknowledgment does not constitute final confirmation of conference participation.\n\nBest regards,\n\n14th APBiomech Organizing Committee\nInstitut Teknologi Bandung'+(mode==='TEST'?'\n\nSYNTHETIC TEST — no actual participant registration.':'')
  };
}
function sendAcknowledgment_(data,receipt,config) {
  if (!config.emailEnabled || receipt.duplicate) return receipt.emailStatus;
  var status='FAILED';
  try {
    if (MailApp.getRemainingDailyQuota()<1) status='QUOTA_EXCEEDED';
    else {
      var message=acknowledgmentEmail_(data,receipt,config.mode);
      var options={to:data.email,subject:message.subject,body:message.body,name:'14th APBiomech Organizing Committee'};
      if (config.replyTo) options.replyTo=config.replyTo;
      MailApp.sendEmail(options);status='SENT';
    }
  } catch (_) { status='FAILED'; }
  // A saved registration survives mail/quota failure. No automatic resend on a network retry.
  try {setAcknowledgmentStatus_(config,receipt.id,status);} catch (_) {status='STATUS_UNKNOWN';}
  return status;
}
