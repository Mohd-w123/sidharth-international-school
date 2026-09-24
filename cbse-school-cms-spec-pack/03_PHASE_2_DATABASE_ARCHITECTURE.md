# Phase 2 — Database Architecture

## Goal
Design and implement the MongoDB + Mongoose architecture required by all future modules.

## Prompt

Analyze all future phases before designing schemas.

Create appropriate schemas for:
- Users
- Roles
- Permissions
- Pages
- Page Blocks
- Homepage Configurations
- Menus
- Menu Items
- Media
- News
- Events
- Gallery Albums
- Gallery Items
- Faculty
- Academic Programs
- Classes
- Subjects
- Academic Calendar
- Admissions
- Results
- Disclosure Categories
- Disclosure Sections
- Disclosure Fields
- Disclosure Tables
- Disclosure Documents
- Transfer Certificates
- Forms
- Form Fields
- Form Submissions
- Site Settings
- Audit Records where required

Every schema should consider:
- ObjectId relationships
- indexes
- validation
- timestamps
- status
- ordering
- soft deletion where appropriate
- createdBy
- updatedBy

Avoid unnecessary duplication and design indexes for common searches.

Support future white-label/multi-school expansion conceptually, but do not implement multi-tenancy unless required.

Document relationships and verify schemas compile.

Do not build business UI. Do not start Phase 3.
