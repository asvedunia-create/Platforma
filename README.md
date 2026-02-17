# GRC Lite MVP

Production-oriented MVP for small businesses in Ukraine focused on ISO 27001/27002 and basic PCI DSS.

## Repository structure

```text
app/
  (auth)/login/page.tsx
  (protected)/dashboard|risks|controls|tasks|evidence/page.tsx
  api/
    auth/[...nextauth]/route.ts
    auth/register/route.ts
    risks|controls|tasks|evidence/route.ts
    exports/risks|controls/route.ts
components/ui/button.tsx
lib/
  auth.ts prisma.ts validations.ts audit.ts session-org.ts rbac.ts utils.ts
prisma/
  schema.prisma
  seed.ts
scripts/
  start-icon.mjs
GRC-Lite-Start.bat
GRC-Lite-Start.command
Dockerfile
docker-compose.yml
.env.example
```

## Run via icon (one-click)

### Windows
1. Clone/open project folder.
2. Double-click `GRC-Lite-Start.bat`.
3. Optional: create desktop shortcut for this `.bat` file.

### macOS/Linux
1. Open project folder.
2. Double-click `GRC-Lite-Start.command` (or run it in terminal).
3. Optional: create desktop shortcut for this file.

What launcher does automatically:
- checks Node.js and Docker availability
- runs `node scripts/start-icon.mjs` directly (no PowerShell `npm.ps1` blocker)
- creates `.env` from `.env.example` if missing
- starts PostgreSQL container
- installs npm dependencies
- runs Prisma generate + `db push`
- runs seed
- starts dev server on `http://localhost:3000`

## Local run (manual)

1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. For local app + docker db, use localhost DB host in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grclite?schema=public"
   ```
3. Install deps:
   ```bash
   npm install
   ```
4. Start PostgreSQL (Docker) and app (local):
   ```bash
   docker compose up -d db
   npx prisma db push
   npm run prisma:seed
   npm run dev
   ```

Demo user after seed: `admin@grclite.local / Admin1234!`.

## Full Docker run

```bash
docker compose up --build
```

## MVP simplifications

- Evidence files are metadata-only (URL/file name), no object storage upload pipeline.
- Task comments are modelled but UI for comments is not implemented yet.
- Multi-organization switching is not implemented; first membership is used.

Extension ideas: S3/MinIO uploads, background reminders, richer audit diff viewer, policy templates, automated evidence collection.
