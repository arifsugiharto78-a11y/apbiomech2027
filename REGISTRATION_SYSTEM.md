# Participant registration system

The 14th APBiomech participant form is at `/registration/portal/`, linked from the fees page and existing navigation. Astro/GitHub Pages remain static. Microsoft CMT remains separate. Payment processing is disabled. The original fee benchmarks remain planning estimates only and are never assigned as a participant's payable fee.

## Current state and ownership

DEMO is active. No endpoint, database identifier, participant records, credentials, or recipient allowlist are shipped in the browser. The owner selected their personal Google account for the future private backend. The connected university Drive account must not be used as a substitute. A live Google deployment and real email delivery have not been verified; see `GOOGLE_APPS_SCRIPT_SETUP.md` for the remaining account setup.

The owner previously authorized every website update to be committed to the personal GitHub repository and published to the demo. This authorization covers this DEMO implementation, not LIVE collection, Google permission grants, or activation of payments.

## Modules

| Module | Responsibility |
| --- | --- |
| `src/components/RegistrationForm.astro`, `RegistrationField.astro` | Accessible form markup and conference identity |
| `src/styles/registration-form.css` | Readable responsive form styling |
| `src/registration/form.ts` | Conditional fields, retained entries, validation, transport and acknowledgment UI |
| `registration/core.mjs` | Shared input validation, spreadsheet/HTML escaping |
| `src/data/registration-system.json` | Public mode and endpoint configuration; never put secrets here |
| `backend/google-apps-script/` | Private Sheets storage, ID reservation, email template, server validation and disabled payment interface |
| `scripts/prepare-registration.mjs` | Copies the shared core to Apps Script and checks activation configuration |

## Modes and workflow

DEMO: complete form, synthetic `@example.invalid` address, no requests and no emails. The sample receipt `DEMO-APB2027-0001` is deliberately not a real registration number. Entries remain in page memory only; closing/reloading may clear them. No local/session storage or analytics is introduced.

TEST: requires a separately deployed Apps Script TEST project, private test spreadsheet and recipient allowlist. All details except the approved test mailbox must be synthetic. Native POST opens a separate acknowledgment tab; the original form is preserved. This page cannot read the cross-origin response and never claims success merely because a request started. The response tab is authoritative.

LIVE: requires explicit committee authorization, an approved privacy/terms version, a separate private LIVE spreadsheet/project, and matching server/frontend configuration. Build guards and independent server guards reject incomplete activation. Administrative configuration flags record an approval decision; they do not replace obtaining approval. Before LIVE, replace draft notices and update all DEMO-specific introductory/FAQ content. Do not enable LIVE as part of this demonstration.

## Fields and rules

Required: given/single name, email and confirmation, international phone, institution, department (Not applicable allowed), country/region, position, category, APAB membership, participation type, invitation requirement, workshop interest, three agreements. Family name and title are optional. Names are not restricted to Latin letters or a two-part structure.

Student category requires degree programme and full/part-time student status. Presenting authors select oral, poster, or not yet confirmed; CMT IDs remain optional, with up to 20 comma/space/semicolon-separated IDs. Hidden conditional fields are disabled in the browser and cleared by the server. Changing category does not erase the browser's prior entries.

Dietary requirements and accessibility arrangements are optional, limited to 500 characters each. Comments are limited to 1,000. Request only practical arrangements, never documents, diagnoses, banking details or passport scans. No uploads exist. Field bounds and enumerations are in the shared core. Client errors identify each field and link to it; invalid entries stay in the form. Server validation remains independent.

## Reliability and abuse controls

Each page instance generates a random submission UUID. Retry retains it. A script lock covers duplicate checks, counter reservation, row append and email-state updates. A counter plus the maximum existing ID prevents reuse after a counter reset. Gaps after a failed write are allowed. Email uniqueness is case-insensitive within a database. Same-key/same-payload retries return the original receipt without another email. Changed payloads using the same key are rejected; corrections require committee handling.

Controls include bounded payload/field lengths, enum checks, honeypot, minimum 3-second/maximum 24-hour form age, rejection of repeated/unknown parameters, TEST recipient allowlist, per-minute/day global acceptance caps, and no participant contents in logs. The timestamp/honeypot can be forged. Apps Script does not provide a dependable client IP in this interface; these are basic protections, not a full anti-bot or DDoS service. Monitor quotas and pause the backend on abuse. Add a committee-approved server-verified challenge if needed before LIVE.

Google services and HTTP delivery are not transactional together. A row may be saved even if its response is lost. Retry the same key to recover it. Email is claimed before sending and not automatically resent on retry. `SENDING` or `STATUS_UNKNOWN` requires private operator review to avoid duplicate email. SENT means accepted by MailApp, not inbox delivery. Fee, payment reference and currency stay blank; payment starts NOT_REQUESTED and registration RECEIVED.

## Verification

Run `npm run check`, `npm test`, `npm run build`, `npm run verify`, and `npm run review:publication`. Automated tests exercise server logic against an in-memory Apps Script service emulator, including lock ownership on writes, duplicate/changed retries, ID recovery, quotas, formula injection, mail failure and activation guards. This does not prove Google deployment permissions, real simultaneous Apps Script execution, mail delivery, or browser behavior on Google's redirects. Complete the personal-account TEST checklist before LIVE.

## Committee operation

Implementation verification on November 25, 2026: 21 Node tests passed; Astro check reported no errors/warnings; 41 static pages built and verified. Browser checks covered missing fields, retained entries, mismatched emails, student/presenter conditional fields, multiple CMT IDs, a blank family name, demo acknowledgment and 1440/768/320-pixel layouts with 18-pixel form text and no horizontal page overflow. No browser console errors were reported. A native browser POST between two local origins reached the emulated backend with Unicode and plus signs preserved, produced one synthetic row and a receipt, and sent zero emails. The in-app browser did not expose the newly opened response tab in its tab inventory; actual Google/new-tab end-to-end checks remain pending. No Google Sheet was created or connected and no acknowledgment email was sent from the selected personal account.

Keep the private database out of GitHub, including CSV exports, logs and screenshots containing rows. Give access only to approved committee accounts. Use Google account multifactor authentication. Confirm a receipt in the database before responding to a lost-email query; never identify participants from public request logs. Handle corrections and deletion requests through the approved private contact process. Do not change payment or registration status in response to an unverified email or browser field.

Privacy policy approval must define controller/contact, purpose/legal basis, optional arrangement handling, international processing, retention duration and rights procedures. After approval, record the retention duration in a private committee operations document. Review expired records monthly, verify legal/accounting holds, delete approved rows and any authorized exports, and apply the committee's Google Drive trash/backup retention procedure. Preserve the ID counter so deleted IDs are never reused. Do not create automatic deletion triggers until this policy is approved.
