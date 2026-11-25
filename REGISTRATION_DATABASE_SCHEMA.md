# Private registration database schema

Use a **Restricted** Google Sheet owned by the selected personal account, with a `Registrations` tab. TEST and LIVE use separate spreadsheets and preferably separate Apps Script projects. No real participant records belong in GitHub. `Schema.gs` is the authoritative ordered header list, and the server refuses a mismatched header row.

All 37 columns are written as plain text, with formula-leading characters additionally escaped. The ID is unique per database; TEST IDs have the requested APB2027 format but never represent LIVE registrations. No tax rules, discounts or payable fees are inferred from planning estimates.

| Column | Source or initial value |
| --- | --- |
| Registration ID | APB2027-0001, incrementing under script lock |
| Submission timestamp | Server ISO UTC timestamp |
| Academic title | Optional |
| Given name | Required; supports a single name |
| Family name | Optional |
| Email | Required, trimmed/lowercase; unique within database |
| Phone number | International number with leading + |
| Institution | Required |
| Department | Required; Not applicable allowed |
| Country | Required CLDR two-letter country/region code, selected using English display names |
| Professional position | Required |
| Registration category | Regular participant / Student participant / Accompanying person |
| APAB membership | Member / Non-member; no automatic discount |
| Participation type | Presenting author / Non-presenting participant |
| Presentation type | Conditional; oral / poster / not yet confirmed |
| CMT abstract IDs | Optional, multiple; not an abstract submission |
| Student status | Conditional full-time / part-time |
| Dietary requirements | Optional practical arrangements, max 500 characters |
| Invitation letter requirement | Yes / No; no automatic letter generated |
| Additional requests | Optional accessibility arrangements, max 500 characters |
| Privacy consent | yes, required |
| Registration fee | Blank until separately approved |
| Currency | Blank until separately approved |
| Payment reference | Blank; no gateway active |
| Payment status | PENDING initially; displayed as Pending Payment; no payment requested |
| Registration status | RECEIVED initially |
| Acknowledgment email status | DISABLED / SENDING / SENT / FAILED / QUOTA_EXCEEDED; STATUS_UNKNOWN can appear in a response when status persistence fails |
| Attendance status | NOT_RECORDED initially |
| Degree programme | Required only for students |
| Workshop interest | Interested / Not interested / Undecided; no booking |
| Additional comments | Optional, max 1,000 characters |
| Terms consent | yes, required |
| Accuracy consent | yes, required |
| Consent version | Version validated against private server configuration |
| Submission key | Random client UUID; private idempotency reference |
| Payload fingerprint | SHA-256 of normalized submitted fields, excluding timing/honeypot/confirmation email |
| Registration mode | TEST or LIVE |

The confirmation email address is validated but not stored a second time. Synthetic-data consent is checked in TEST. Do not add passport scans, financial credentials or medical documents. Rows are not public receipts or invoices. Staff must not interpret RECEIVED or SENT as acceptance, payment, attendance, or confirmed participation.

The next-ID counter lives in Script Properties. Reserve it before appending while holding the same lock as duplicate checks. Always preserve the counter through deletion, migration and archival; gaps are acceptable. Do not sort one column alone, rename headers or insert columns without migrating the schema and tests. Whole-row filters/sorting are permitted while submissions are paused.

Use one writer Apps Script project per database. A script lock coordinates that project's executions, not unrelated projects or manual spreadsheet edits. Do not point two independent writer projects at the same Sheet, and pause collection before administrative row edits.

Keep exports, private script property values and operational logs in restricted committee storage. Deletion/retention durations and legal holds require committee approval. Remove expired rows only after that review, preserve the counter, and include backups/exports/Drive trash in the documented process.
