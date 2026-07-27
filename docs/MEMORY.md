# DoorLoop Property Management ERP - Developer Memory & Context Snapshot

> [!IMPORTANT]
> This document serves as the persistent context memory for the DoorLoop Property Management ERP backend architecture, database schemas, mockApi data scale, environment settings, and step-by-step implementation guide.

---

## 1. Core Technical Baseline

- **Project Core**: Node.js (LTS), Express.js framework, TypeScript.
- **Data Layer**: MySQL, Prisma ORM, Prisma Client.
- **Authentication**: JWT (Access Token 15m + Refresh Token 7d), `bcrypt` password hashing.
- **Security & Network**: `helmet`, `cors`, `express-rate-limit`, `zod` input validation schemas.
- **Observability**: `morgan` HTTP logger, `pino` structured logger, `uuid` trace IDs (`X-Request-ID`).
- **Frontend Source Reference**: Frontend mock API layer location: [mockApi.ts](file:///c:/Users/admin/OneDrive/Desktop/Doorloop/correctionPropertyUI/Frontend/src/api/mockApi.ts).

---

## 2. Seed Data Scale Reference (Translated from `mockApi.ts`)

When populating the PostgreSQL database via `prisma/seed.ts`, match the dataset volume established in `mockApi.ts`:

| Entity / Domain | Seeded Records Volume | Key Invariants / Notes |
| :--- | :--- | :--- |
| **Owners** | 3 base owners | William Anderson, Patricia Thomas, Robert Miller |
| **Properties** | 10 properties | Oakridge Heights, Downtown Plaza, Sunset Villas, etc. |
| **Buildings** | 30 buildings | 3 buildings per property |
| **Units** | 200 units | 20 units per property (Occupied, Vacant, Reserved, Under Maintenance) |
| **Tenants** | 500 tenants | Active (1-170), Pending (171-195), Inactive (196+) |
| **Leases** | 260 leases | Active (1-200), Pending (201-230), Expired (231-250), Terminated (251+) |
| **Applications** | 160 applications | Pending (90), Approved (40), Rejected (30) |
| **Leads** | 130 leads | Pipeline stages from Zillow, Apartments.com, Referrals |
| **Rent Payments** | 5,000 payments | Paid, Pending, Partially Paid, Failed statuses |
| **Owner Documents**| 2,010 documents | Statements, Tax Documents, Contracts, Inspection Reports |
| **Tenant Documents**| 4,010 documents | Leases, Notices, Receipts, Insurance Policies |
| **Tenant Messages** | 3,010 messages | Direct conversations between tenants and management |
| **Communication Contacts**| 5,010 contacts | Tenants, Owners, Vendors, Applicants, Employees |
| **Comm Templates** | 410 templates | Rent Reminders, Renewals, Late Fee Notices, Maintenance |

---

## 3. Environment Variables Reference Configuration

```env
# Application Server
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:5173

# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/doorloop_erp"

# Security & JWT Tokens
JWT_ACCESS_SECRET="super-secret-access-token-key-change-in-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="super-secret-refresh-token-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=12

# Storage & Third-Party Mock Services
AWS_S3_BUCKET="doorloop-erp-documents"
STRIPE_SECRET_KEY="sk_test_mock_stripe_key"
QUICKBOOKS_CLIENT_ID="mock_qb_client_id"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 4. Backend Implementation Action Roadmap

```mermaid
gantt
    title Backend Development Roadmap Phases
    dateFormat  YYYY-MM-DD
    section Setup & DB
    Initialize Express + Prisma    :a1, 2026-08-01, 2d
    Prisma Schema & Migrations    :a2, after a1, 3d
    Database Seeder (mockApi)      :a3, after a2, 3d
    section Auth & Core
    JWT Auth & RBAC Middleware     :b1, after a3, 3d
    Properties & Units APIs        :b2, after b1, 3d
    Leases & Applicants APIs       :b3, after b2, 3d
    section Billing & Accounting
    Rent Collection & Payments     :c1, after b3, 4d
    Double-Entry Chart of Accounts :c2, after c1, 4d
    section Operations & DMS
    Work Orders & Maintenance      :d1, after c2, 3d
    DMS E-Signatures & Messaging   :d2, after d1, 4d
```

### Phase 1: Environment & Prisma Setup
1. Initialize Node.js Express TypeScript project structure.
2. Configure `prisma/schema.prisma` with all models defined in `ARCHITECTURE.md`.
3. Run `npx prisma migrate dev --name init` to generate PostgreSQL tables.
4. Execute `prisma/seed.ts` script to populate database using `mockApi.ts` data scale.

### Phase 2: Security & Authentication Layer
1. Build `auth.middleware.ts` to extract & verify JWT tokens from `Authorization` headers.
2. Build `rbac.middleware.ts` to check permission matrices against dynamic role definitions.
3. Build `zod` input validation schemas for all request payloads.
4. Configure `helmet`, `cors`, and `express-rate-limit`.

### Phase 3: Domain Controllers & Services Implementation
1. Implement Property, Building, and Unit CRUD controllers with automatic metric rollups.
2. Implement Lease and Tenant controllers with background screening triggers.
3. Implement Rent Collection, Invoicing, Charges, and Security Deposit handlers.
4. Implement Double-Entry Accounting ledger calculation engine (Debits = Credits).
5. Implement Maintenance Work Orders, Vendors, Inspections, and DOB Violation controllers.
6. Implement Owner & Tenant Portal endpoints.
7. Implement Document Management System (DMS) file uploads & E-Signature workflows.

### Phase 4: Verification & Integration Testing
1. Run Integration Tests (Jest / Supertest) against Express routes.
2. Connect Frontend API client (`client.ts`) to backend endpoints.
3. Validate global audit logging and request tracing headers (`X-Request-ID`).

---

## 5. Critical Gotchas & Design Pitfalls to Avoid

- **Double-Entry Ledger Integrity**: NEVER save a `JournalEntry` without validating `sum(debits) === sum(credits)`. Wrap journal posts inside Prisma atomic transactions (`prisma.$transaction`).
- **Cascade Deletes**: Avoid hard cascading deletes on financial or lease tables. Use soft deletes (`status: 'Inactive'`) or status flags (`Terminated`, `Voided`).
- **BigInt & Currency Floating Points**: Store currency amounts as `Float` or fixed precision `Decimal` in Prisma to avoid floating-point rounding discrepancies (e.g. `$1850.00`).
- **Prisma Relations**: When querying properties, include explicit select/include criteria to prevent N+1 query performance degradation on large datasets (5000+ payments).
