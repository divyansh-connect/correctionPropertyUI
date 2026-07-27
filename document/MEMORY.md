# Backend Project Memory / Rules

1. This backend is being built for the existing DoorLoop-style property management UI.
2. The existing frontend is the source of truth for visible workflows and feature domains.
3. The current `src/api/mockApi.ts` is mock data/service behavior and must be replaced by real API calls without changing the UI flow.
4. Frontend changes are out of scope unless explicitly requested.
5. Required stack is fixed: Node.js LTS, Express.js, Prisma ORM, PostgreSQL, JWT access + refresh tokens, bcrypt, Helmet, CORS, express-rate-limit, Zod or express-validator, dotenv, Morgan, Pino or Winston and UUID.
6. All company/workspace data must be isolated by authenticated `companyId`.
7. Owner and tenant portals must enforce ownership/identity server-side.
8. Passwords and refresh tokens must never be stored in plaintext.
9. Financial and audit records must preserve history.
10. All mutations must validate input and authorization.
11. AI is only for DoorLoop/property-management workflows and must use normal backend authorization and service methods.
12. No direct frontend-to-database access.
13. No secrets in source code.
14. Use Prisma migrations for schema changes.
15. Keep API responses stable and predictable for frontend integration.
16. The API should be implemented incrementally, but the final architecture must support all mock API domains: property, building, unit, tenant, leasing, rent, payments, invoices, charges, deposits, payment plans, refunds, accounting, maintenance, vendors, owner portal, tenant portal, communication, documents, analytics, reports, dashboards, AI, users, roles, companies, teams, integrations, API keys, webhooks, audit logs, activity, security and billing.
