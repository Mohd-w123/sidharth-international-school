# Phase 18 — Dynamic Form Builder

## Goal
Build a completely dynamic Form Builder.

## Prompt

Admin can create unlimited forms.

Examples:
- Contact Form
- Admission Enquiry
- Admission Application
- Career Application
- General Enquiry

Do not hardcode individual form structures.

Supported field types:
- text
- textarea
- email
- phone
- number
- select
- multi-select
- radio
- checkbox
- date
- file upload

Each field supports:
- label
- field name
- type
- required
- placeholder
- help text
- default value where appropriate
- validation
- options
- display order

Admin:
- create form
- edit form
- add field
- remove field
- reorder fields
- configure validation
- activate/deactivate
- preview

Submissions:
- view
- search
- filter
- inspect
- archive/delete
- export where appropriate

Security:
- server-side validation
- file validation
- malicious upload protection
- spam protection
- rate limiting where appropriate

Use React Hook Form + Zod.

Integrate Admissions and future Careers through the same Form Builder.

Do not duplicate form logic.

Do not start Phase 19.
