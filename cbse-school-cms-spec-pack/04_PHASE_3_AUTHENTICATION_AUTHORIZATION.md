# Phase 3 — Authentication & Authorization

## Goal
Build secure Admin authentication and RBAC.

## Prompt

Use Auth.js/NextAuth with the chosen secure strategy.

Implement:
- Login
- Logout
- Session handling
- Password hashing
- Forgot Password
- Reset Password
- Protected admin routes
- Middleware
- RBAC

Roles:
1. Super Admin
2. School Admin
3. Content Editor
4. Admission Manager

Implement granular permissions for:
- view
- create
- update
- delete
- publish

Authorization must be enforced server-side, not only in the UI.

Create:
- auth configuration
- middleware
- permission helpers
- session helpers
- protected route handling
- initial Super Admin seed/setup without hardcoded passwords

Test valid/invalid login, protected routes, unauthorized role access, logout, and session expiration.

Run TypeScript, lint, and build. Do not start Phase 4.
