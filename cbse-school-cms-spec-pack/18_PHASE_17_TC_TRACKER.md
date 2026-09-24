# Phase 17 — Transfer Certificate Tracker

## Goal
Build a secure public TC Tracker and Admin Management module.

## Public

Create `/tc-tracker`.

Allow search using:
- Admission Number
- Date of Birth

Do not expose unnecessary student information.

If valid, display only necessary verification information such as:
- student name
- parent name where required
- class
- session
- TC number
- issue date
- status

Provide secure TC PDF download.

If no record exists, show a clear generic message such as “No Transfer Certificate Found.”

Do not reveal whether similar records exist.

## Admin

Support:
- create TC
- edit TC
- archive/delete TC
- search
- filter
- pagination
- upload PDF
- replace PDF
- status management
- bulk import where appropriate

Potential fields:
- admission number
- student name
- parent name where required
- date of birth
- class
- session
- TC number
- issue date
- status
- document

Validate required fields, identifiers, PDF type/size, and authorization.

Use secure server-side search and never expose sensitive database fields through public APIs.

Test valid search, invalid search, no result, document download, unauthorized operation, and PDF replacement.

Do not start Phase 18.
