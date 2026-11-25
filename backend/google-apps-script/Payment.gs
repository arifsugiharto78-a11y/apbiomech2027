// Interface constants only. No provider, payment links, fees, webhooks, or transitions are active.
var PAYMENT_STATUSES=['NOT_REQUESTED','PENDING','PAID','VERIFIED','FAILED','REFUNDED'];
var REGISTRATION_STATUSES=['RECEIVED','PENDING_PAYMENT','CONFIRMED','CANCELLED'];
function paymentStatusLabel_(status) {
  return {NOT_REQUESTED:'Not requested',PENDING:'Pending Payment',PAID:'Paid',VERIFIED:'Verified',FAILED:'Failed',REFUNDED:'Refunded'}[status]||'To be confirmed';
}
function paymentIntegrationState_() {
  return {enabled:false,provider:null,paymentStatuses:PAYMENT_STATUSES,registrationStatuses:REGISTRATION_STATUSES};
}
