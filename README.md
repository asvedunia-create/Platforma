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
Dockerfile
docker-compose.yml
.env.example
```

## Local run

1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Install deps:
   ```bash
   npm install
   ```
3. Start PostgreSQL (Docker) and app (local):
   ```bash
   docker compose up -d db
   npx prisma migrate dev
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
