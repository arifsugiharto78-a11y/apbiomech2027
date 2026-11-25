// Interface constants only. No provider, payment links, fees, webhooks, or transitions are active.
var PAYMENT_STATUSES=['NOT_REQUESTED','PENDING','PAID','VERIFIED','FAILED','REFUNDED'];
var REGISTRATION_STATUSES=['RECEIVED','PENDING_PAYMENT','CONFIRMED','CANCELLED'];
function paymentIntegrationState_() {
  return {enabled:false,provider:null,paymentStatuses:PAYMENT_STATUSES,registrationStatuses:REGISTRATION_STATUSES};
}
