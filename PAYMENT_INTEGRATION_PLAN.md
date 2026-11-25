# Future payment integration — disabled

No provider, link, card/bank form, transaction, webhook, invoice or payment request is implemented. The participant-facing statement is: “Registration fees and payment arrangements will be announced once confirmed by the organizing committee.” Existing IDR planning benchmarks are not copied to registration records.

`Payment.gs` exports a disabled interface state and the permitted state names. Database columns reserve Registration fee, Currency, Payment reference and Payment status. The first three stay blank; status starts PENDING, displayed as Pending Payment, as requested. This means payment arrangements are pending, without requesting payment or creating a provider transaction.

| Payment status | Future meaning, subject to approved workflow |
| --- | --- |
| NOT_REQUESTED | No payment request issued |
| PENDING | Payment arrangements or completion are pending; no transaction is implied |
| PAID | Provider reports payment; reconciliation pending |
| VERIFIED | Committee/provider reconciliation completed |
| FAILED | Verified failure |
| REFUNDED | Verified refund |

Registration statuses are RECEIVED, PENDING_PAYMENT, CONFIRMED and CANCELLED. Registration acknowledgment only creates RECEIVED; it cannot confirm participation. Payment and registration state are independent, so a refund or failed payment must not silently cancel a registration without an approved policy.

After committee approval, select a provider, official fees/currency/tax/invoice/refund rules and a protected server integration. Keep provider secrets outside GitHub. Create a separate server-only adapter exposing conceptual operations `createPaymentRequest(registrationId, approvedFeeVersion)`, `verifyProviderEvent(event)` and `reconcilePayment(registrationId)`. No callable implementation exists yet.

The server must look up approved fees, authenticate provider events, verify signatures and amount/currency, record event IDs for idempotency, and apply only approved transitions under a lock. Never trust payment status, fee or reference from this public form or a return URL. Do not insert financial details into URLs, Sheets notes, browser storage or public logs. Review hosting/platform limits before choosing webhook architecture. Rehearse provider sandbox flows and reconciliation before enabling production; no account setup, paid service, official domain or payments are authorized by this stage.
