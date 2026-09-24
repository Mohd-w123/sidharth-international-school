# Phase 0 — Project Foundation

## Goal
Establish the production-ready foundation for the CBSE School CMS.

## Prompt

Inspect the repository before making changes. Determine the current Next.js version, dependencies, architecture, components, configuration, database setup, authentication, and environment configuration. Preserve useful existing work.

If empty, initialize Next.js with App Router, TypeScript, Tailwind CSS, ESLint, and strict TypeScript.

Configure:
- ESLint
- Prettier
- strict TypeScript
- path aliases
- environment variable structure

Establish scalable feature-based architecture for:
- `src/app`
- `src/components`
- `src/features`
- `src/lib`
- `src/models`
- `src/actions`
- `src/services`
- `src/repositories`
- `src/hooks`
- `src/types`
- `src/config`

Create:
- root layout
- public layout placeholder
- admin layout placeholder
- loading handling
- error handling
- not-found handling
- MongoDB/Mongoose connection abstraction
- environment configuration

Do not create business models or modules.

Do not implement authentication, CMS, homepage, news, gallery, admissions, academics, disclosure, TC, or forms.

Run TypeScript, lint, and production build. Fix errors. Do not start Phase 1.
