# Google Apps Script setup

Prepared for the owner's personal Google account. No Google backend has been deployed by this update. Do not use the connected university account or publish a spreadsheet. Do not put any spreadsheet ID, allowlist, account information, OAuth token, or script property values in GitHub.

## 1. Prepare the private TEST database

Sign in to the selected personal account. Create a blank Google Sheet named `14th APBiomech — TEST registrations (synthetic only)`. Keep General access **Restricted**; verify the sharing list has only the owner and explicitly approved test operators. Do not use Publish to web or Anyone with the link. The database must not be in a publicly shared folder.

Create a standalone Apps Script project in the same account named `14th APBiomech registration TEST`. This keeps script properties/counters and spreadsheet access separate from any future LIVE project. Run `npm run prepare:registration` locally, then copy each `.gs` file from `backend/google-apps-script/` into the Apps Script editor, keeping file names. Enable the manifest in Project Settings and copy `appsscript.json`. `Core.gs` is generated; edit `registration/core.mjs` in the repository and regenerate it for future changes.

## 2. Configure Script Properties privately

| Property | TEST setting |
| --- | --- |
| REGISTRATION_MODE | TEST |
| TEST_SPREADSHEET_ID | ID of the restricted TEST spreadsheet |
| CONSENT_VERSION | 2026-11-25-draft |
| TEST_EMAIL_ALLOWLIST | Comma-separated approved test mailboxes; never arbitrary participants |
| ACK_EMAIL_ENABLED | false initially; true only when deliberately testing acknowledgment email |
| ACK_REPLY_TO | Optional approved committee mailbox; otherwise omit |
| MAX_ACCEPTED_PER_MINUTE | 10 (default; maximum 100) |
| MAX_ACCEPTED_PER_DAY | 100 (default; maximum 2000; lower to fit account quotas) |

Leave LIVE_SPREADSHEET_ID, LIVE_AUTHORIZATION and PRIVACY_APPROVED unset. Never store credentials in code. The endpoint URL is public configuration, not a secret or authentication token.

Select `initializeRegistrationDatabase_` in the Apps Script editor and run it. The owner must review Google's permissions request: spreadsheet access and email sending are declared in the manifest. This is an external account permission step, not something the website can grant. The function creates the 37-column Registrations tab, freezes headers and formats data cells as plain text. Run it again safely to verify header order; existing rows are not replaced. Verify the Google Sheet is still Restricted.

## 3. Deploy TEST web app

Use Deploy → New deployment → Web app. Execute as the owner, and choose access that allows the intended external test browsers (typically Anyone, if allowed by the account). Review this public endpoint access before approving it. Only the endpoint is public; the Sheet stays private. If account policy disallows anonymous web apps, do not weaken account security; resolve the hosting decision with the committee.

Copy the versioned `/exec` URL, not the editor-only `/dev` URL. In a temporary local TEST checkout, set mode TEST and endpoint to that URL in `src/data/registration-system.json`, with the same consentVersion. Keep the published main branch DEMO unless a TEST preview is specifically requested. Rebuild and use synthetic fields plus an allowlisted mailbox. For the future custom domain, the same native POST works without an origin allowlist; internal conference links continue to use `withBase`. Do not connect the domain now.

## 4. Transport and response behavior

The browser submits `application/x-www-form-urlencoded` using a native HTML form POST into a new tab. Apps Script `doPost(e)` reads `e.parameter` and rejects duplicate parameters from `e.parameters`. The response is an escaped HtmlService acknowledgment. There are no cross-origin JSON requests, custom request headers, opaque `no-cors` fetch responses, hidden iframe callbacks, or success assumptions from a navigation event. The original page retains entries and exposes an explicit retry action with the same UUID. Popup/browser/network blocking is handled by telling the user to check the response tab or retry; JavaScript cannot read the cross-origin response.

Google's redirect/login/Workspace behavior must be tested on the actual deployment. The local two-origin transport test and emulated backend tests do not certify the Google web app. Reference: [Google web app request parameters and deployment](https://developers.google.com/apps-script/guides/web), [HTML service](https://developers.google.com/apps-script/guides/html), [HTML form target and encoding](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form).

## 5. Required real-service TEST checklist

1. Run `runSyntheticSmokeTest_` once with a chosen allowlisted test mailbox. With email enabled this deliberately sends one clearly marked synthetic email. Verify one row, a unique APB2027-0001-style ID, receipt/status, and a single email. Repeated runs with the same email are rejected; use another approved alias for a new test.
2. From the local TEST preview and a logged-out/incognito browser, submit synthetic details. Verify the new tab displays a Google-served receipt, the private Sheet has one new row, and all Unicode/plus signs and conditional fields survive URL encoding.
3. Retry the same submission: same receipt, no extra row/email. Try another submission key with the same email: duplicate rejected without disclosure of an existing ID. Try mismatched email, missing agreements, unknown enum, invalid phone, honeypot, too-fast, repeated parameters, changed payload and non-allowlisted mailbox: no new record.
4. Submit distinct approved test mailboxes from two browser tabs at once. Verify distinct IDs and no row corruption in actual Apps Script execution. The lock tests in Node enforce adapter calls but cannot prove Google's runtime concurrency.
5. Verify email SENT plus actual inbox/spam delivery. Temporarily disable email and verify DISABLED; quota/failure handling is covered locally and should be rehearsed without exhausting the account's production quota. An unsent email must not discard a saved registration.
6. Check Chrome, Firefox/Safari where available, phone/tablet, popup blocking, slow/offline requests, Google account login/redirect behavior and future BASE_PATH=/ build. Never use real participant information for these tests.
7. Record date, deployment version, test results and remaining issues in a **private** committee log. Reset/replace the synthetic database only after stopping test submissions; do not reset a LIVE counter.

Apps Script quotas vary by account and may change: check [current quotas](https://developers.google.com/apps-script/guides/services/quotas). Monitor daily email allowance and script executions. Do not rely on the default caps as a promise of service capacity.

## 6. Future LIVE activation — not part of this update

Obtain explicit committee approval, final privacy/terms/controller/contact/retention policy, and completion of the TEST checklist. Create a separate restricted LIVE Sheet and separate Apps Script project, retaining the schema. Configure LIVE_SPREADSHEET_ID, a distinct TEST_SPREADSHEET_ID, REGISTRATION_MODE=LIVE, PRIVACY_APPROVED=true, an approved non-draft CONSENT_VERSION, and LIVE_AUTHORIZATION containing the private approval reference. Configure acknowledgment/reply-to and accepted caps. Initialize and deploy that project only with authorization.

For the frontend, record the approval reference in committeeAuthorization, set privacyApproved=true, approved consentVersion, endpoint, and mode LIVE; replace draft notices and DEMO-specific copy in pages.ts/FAQ. Do not publish private approval documents. Keep the public reference minimal. Have the committee review the complete result before activation. Payment remains disabled independently. Roll back collection by setting server mode DEMO and frontend mode DEMO; deploying only the static rollback does not disable an already public backend.

## Recovery and deletion

Never return raw exceptions to users. Public logs contain only an opaque request token and outcome code. A lost response may follow a successful write; retry the same UUID. Do not blindly resend SENDING/STATUS_UNKNOWN emails. Review the private row and mail status before a manual resend. Maintain a restricted operator log of any correction, cancellation or deletion. Follow the approved retention process described in REGISTRATION_SYSTEM.md; never upload database snapshots to GitHub.
