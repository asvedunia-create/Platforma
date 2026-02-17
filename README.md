# Platforma

MVP scaffold for an ISMS / GRC web app on Next.js App Router + Prisma.

## Implemented modules
- Routes: `/login`, `/dashboard`, `/risks`, `/controls`, `/controls/[id]`, `/tasks`, `/evidence`, `/settings/org`.
- Auth: NextAuth credentials provider, role-aware session helpers (`requireSession`, `requireRole`).
- RBAC baseline: ADMIN/GRC/VIEWER hierarchy validated in server actions.
- Backend patterns: server action CRUD sample for risks + CSV export endpoint.
- Database schema: multi-tenant entities for users, orgs, membership, risks, controls, tasks, evidence, audit log.
- UI primitives: DataTable, badges/chips, basic forms, dialog placeholders.

## Quick start
1. `npm install`
2. Configure `.env` with `DATABASE_URL` and `NEXTAUTH_SECRET`
3. `npx prisma generate`
4. `npm run dev`
