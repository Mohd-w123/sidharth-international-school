# Phase 7 — Dynamic Page Builder

## Goal
Create unlimited CMS-driven public pages.

## Prompt

Admin can:
- create
- edit
- archive/delete
- publish/unpublish
- change slug
- configure title
- configure banner
- add rich content
- add images
- add videos
- add buttons
- add content blocks
- attach media/documents

Create dynamic public routing based on CMS page slug.

Examples such as `/about`, `/academics`, `/admissions`, `/facilities`, `/sports`, `/library`, `/transport` must be rendered through the generic page system, not separate hardcoded page implementations.

Support draft, published, archived states, slug uniqueness, and preview capability.

Invalid slugs must return proper not-found handling.

Do not start Phase 8.
