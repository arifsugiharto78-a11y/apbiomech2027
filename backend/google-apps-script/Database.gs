function withRegistrationLock_(operation) {
  var lock=LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('BUSY');
  try { return operation(); } finally { lock.releaseLock(); }
}
function registrationSheet_(config) {
  var book=SpreadsheetApp.openById(config.spreadsheetId);
  var sheet=book.getSheetByName('Registrations');
  if (!sheet) throw new Error('CONFIGURATION');
  var headers=sheet.getRange(1,1,1,REGISTRATION_HEADERS.length).getValues()[0];
  if (JSON.stringify(headers)!==JSON.stringify(REGISTRATION_HEADERS)) throw new Error('SCHEMA_MISMATCH');
  return sheet;
}
function registrationHash_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8)
    .map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');
}
function fingerprint_(data) {
  return registrationHash_(JSON.stringify(Object.keys(data).sort().filter(function(k){return !['startedAt','website','confirmEmail'].includes(k);}).map(function(k){return [k,data[k]];})));
}
function acceptRegistration_(data, config) {
  return withRegistrationLock_(function(){
    var sheet=registrationSheet_(config), count=sheet.getLastRow();
    var rows=count>1?sheet.getRange(2,1,count-1,REGISTRATION_HEADERS.length).getValues():[];
    var col=function(name){return REGISTRATION_HEADERS.indexOf(name);};
    var fingerprint=fingerprint_(data);
    var prior=rows.find(function(row){return row[col('Submission key')]===data.submissionKey;});
    if (prior) {
      if (prior[col('Payload fingerprint')]!==fingerprint) throw new Error('RETRY_CHANGED');
      return {id:prior[0],category:prior[col('Registration category')],paymentStatus:prior[col('Payment status')],emailStatus:prior[col('Acknowledgment email status')],duplicate:true};
    }
    if (rows.some(function(row){return String(row[col('Email')]).toLowerCase()===RegistrationCore.safeCell(data.email);})) throw new Error('ALREADY_RECEIVED');
    // A bounded global acceptance limit protects Sheets/email quotas; not an IP-based firewall.
    var cache=CacheService.getScriptCache(), now=Date.now();
    var bucket=JSON.parse(cache.get('registration-accepted-window')||'[]').filter(function(t){return now-t<60000;});
    if (bucket.length>=config.maxPerMinute) throw new Error('RATE_LIMIT');
    var today=new Date().toISOString().slice(0,10);
    if (rows.filter(function(row){return String(row[1]).slice(0,10)===today;}).length>=config.maxPerDay) throw new Error('DAILY_LIMIT');
    var properties=PropertiesService.getScriptProperties();
    var counterKey='REGISTRATION_COUNTER_'+config.mode;
    var stored=Number(properties.getProperty(counterKey)||'0');
    var maxExisting=rows.reduce(function(max,row){var match=String(row[0]).match(/^APB2027-(\d+)$/);return match?Math.max(max,Number(match[1])):max;},0);
    var next=Math.max(Number.isSafeInteger(stored)&&stored>=0?stored:0,maxExisting)+1;
    if (!Number.isSafeInteger(next)) throw new Error('CONFIGURATION');
    var id='APB2027-'+String(next).padStart(4,'0');
    // Reserve before append: failed writes can leave gaps, but cannot reuse reserved IDs.
    properties.setProperty(counterKey,String(next));
    var emailStatus=config.emailEnabled?'SENDING':'DISABLED';
    sheet.appendRow(registrationRow_(data,id,fingerprint,emailStatus));
    SpreadsheetApp.flush();
    bucket.push(now);cache.put('registration-accepted-window',JSON.stringify(bucket),60);
    return {id:id,category:data.category,paymentStatus:'PENDING',emailStatus:emailStatus,duplicate:false};
  });
}
function setAcknowledgmentStatus_(config,id,status) {
  withRegistrationLock_(function(){
    var sheet=registrationSheet_(config), count=sheet.getLastRow();
    if (count<2) return;
    var ids=sheet.getRange(2,1,count-1,1).getValues();
    var index=ids.findIndex(function(row){return row[0]===id;});
    if (index>=0) sheet.getRange(index+2,REGISTRATION_HEADERS.indexOf('Acknowledgment email status')+1).setValue(status);
    SpreadsheetApp.flush();
  });
}
// Run manually from the editor. Never exposed as a web action. Existing rows are untouched.
function initializeRegistrationDatabase_() {
  var config=registrationConfig_();
  if (!config.spreadsheetId) throw new Error('Set the mode-specific spreadsheet ID first.');
  withRegistrationLock_(function(){
    var book=SpreadsheetApp.openById(config.spreadsheetId);
    var sheet=book.getSheetByName('Registrations')||book.insertSheet('Registrations');
    if (sheet.getLastRow()>0) {registrationSheet_(config);return;}
    if (sheet.getMaxColumns()<REGISTRATION_HEADERS.length) sheet.insertColumnsAfter(sheet.getMaxColumns(),REGISTRATION_HEADERS.length-sheet.getMaxColumns());
    sheet.getRange(1,1,1,REGISTRATION_HEADERS.length).setValues([REGISTRATION_HEADERS]).setFontWeight('bold').setBackground('#12334f').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.getRange(2,1,Math.max(sheet.getMaxRows()-1,1),REGISTRATION_HEADERS.length).setNumberFormat('@');
    sheet.setColumnWidths(1,REGISTRATION_HEADERS.length,180);
  });
}
