# Phase 15 — Mandatory Public Disclosure

## Goal
Build a completely dynamic CBSE Mandatory Public Disclosure system.

## Critical Requirement

Do NOT hardcode CBSE disclosure sections, rows, tables, or fields.

The administrator must be able to configure the entire disclosure structure through the CMS.

Support:
1. Disclosure Categories
2. Disclosure Sections
3. Dynamic Fields
4. Dynamic Tables
5. Documents
6. Rich Text
7. Images
8. Links

Admin can:
- create category
- edit category
- archive/delete category
- reorder category
- create/edit/archive/delete/reorder sections
- configure content types
- preview
- publish/unpublish

Supported content types may include:
- text
- textarea
- number
- date
- boolean
- URL
- rich text
- image
- PDF/document
- table

Dynamic table system:
- table title
- custom columns
- column labels
- column data types
- rows
- row ordering

Initial examples may include General Information, Documents and Information, Academic Results, Teaching Staff, and Infrastructure, but these are NOT fixed system sections.

If CBSE requirements change, the admin must be able to create new sections without code changes.

Document management:
- title
- description
- category
- media/file
- display order
- active/inactive

Use Media Library.

Public page must use a generic renderer driven by database configuration. Do not create hardcoded JSX for Section A/B/C/D/E.

Test:
- new category
- new section
- fields
- dynamic table
- rows
- document upload
- reorder
- publish
- public rendering

Do not start Phase 16.
