# Full Backend Implementation Plan

## Required Stack
Node.js LTS, Express.js, Prisma ORM, PostgreSQL, JWT access + refresh tokens, bcrypt, Helmet, CORS, express-rate-limit, Zod or express-validator, dotenv, Morgan, Pino or Winston and UUID.

## Recommended Structure
```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── middlewares/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── lib/
│   ├── utils/
│   └── types/
├── uploads/
├── .env
└── package.json
```

## Core Middleware Order
1. dotenv/config
2. Morgan HTTP logging
3. Helmet
4. CORS allowlist
5. JSON/body limits
6. Rate limiting
7. API routes
8. 404 handler
9. Central error handler

Application logs should use Pino or Winston. Morgan is for HTTP access logs.

## Service Modules
- auth
- users/roles
- companies/teams
- properties/buildings/units
- tenants/owners
- leasing/screening
- rent/payments/invoices
- accounting
- maintenance/vendors
- documents
- communication
- CRM
- reports/analytics
- owner portal
- tenant portal
- AI
- integrations/webhooks
- audit/security/billing

## Environment Variables
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
LOG_LEVEL=info
```

Never commit `.env` or secrets.

## Implementation Order
### Phase 1: Foundation
Express app, config, Prisma, PostgreSQL connection, logging, security middleware, error handling, UUID and health check.

### Phase 2: Authentication
Users, roles, password hashing, login, access/refresh tokens, rotation, logout, forgot/reset password.

### Phase 3: Core Property Data
Companies, properties, buildings, units, owners, tenants.

### Phase 4: Leasing & Rent
Applications, screening, leases, renewals, charges, invoices, payments, deposits, refunds and ledgers.

### Phase 5: Maintenance
Requests, work orders, preventive maintenance, assets, inventory, inspections, vendors and violations.

### Phase 6: Accounting
Chart of accounts, journal entries, general ledger, bank accounts, reconciliation, expenses, income, bills, budgets, taxes and reports.

### Phase 7: Documents & Communication
File metadata, folders, versions, permissions, signatures, requests, audit, email, SMS, notifications, campaigns and conversations.

### Phase 8: Reports, Portals & Admin
Analytics, saved/scheduled reports, dashboards, owner portal, tenant portal, settings, teams, integrations, webhooks and audit logs.

### Phase 9: AI
Only DoorLoop/property-management AI workflows. AI uses existing backend services and authorization; it is not a second database access layer.

## Testing Requirements
- Unit tests for services and validators.
- Integration tests for auth and critical CRUD APIs.
- Transaction tests for payments and accounting.
- Authorization tests for owner/tenant isolation.
- Upload validation tests.
- Rate-limit and security middleware tests.

## Deployment Requirements
Run Prisma migrations during deployment. Use managed PostgreSQL in production. Use environment secrets. Configure CORS with the actual frontend origin. Use HTTPS and secure token handling in production.
