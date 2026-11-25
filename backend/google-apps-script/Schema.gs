// Headers are public schema only. Never commit participant rows or spreadsheet identifiers.
var REGISTRATION_HEADERS = [
  'Registration ID','Submission timestamp','Academic title','Given name','Family name',
  'Email','Phone number','Institution','Department','Country','Professional position',
  'Registration category','APAB membership','Participation type','Presentation type',
  'CMT abstract IDs','Student status','Dietary requirements','Invitation letter requirement',
  'Additional requests','Privacy consent','Registration fee','Currency','Payment reference',
  'Payment status','Registration status','Acknowledgment email status','Attendance status',
  'Degree programme','Workshop interest','Additional comments','Terms consent','Accuracy consent',
  'Consent version','Submission key','Payload fingerprint','Registration mode'
];
function registrationRow_(data, id, fingerprint, emailStatus) {
  return [id,new Date().toISOString(),data.title,data.givenName,data.familyName,
    data.email,data.phone,data.institution,data.department,data.country,data.position,
    data.category,data.membership,data.participation,data.presentation,data.abstractIds,
    data.studentStatus,data.dietary,data.invitation,data.accessibility,data.privacy,
    '', '', '', 'PENDING','RECEIVED',emailStatus,'NOT_RECORDED',data.degree,
    data.workshop,data.comments,data.terms,data.accuracy,data.consentVersion,
    data.submissionKey,fingerprint,data.mode].map(RegistrationCore.safeCell);
}
