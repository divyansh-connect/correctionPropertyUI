# Backend API Specification

## 1. Purpose
This document defines the REST API contract for the Zentrol Property / DoorLoop-style property management UI. The backend must replace the current frontend `src/api/mockApi.ts` without changing frontend business flows.

## 2. Base URL
- Development: `/api/v1`
- Production: `https://<api-domain>/api/v1`
- JSON response format is mandatory.
- IDs are UUIDs.

## 3. Standard Response
```json
{ "success": true, "data": {}, "message": "Success", "meta": {} }
```
Error:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid request", "details": [] } }
```

## 4. Authentication
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

Access token: short-lived JWT. Refresh token: long-lived JWT, stored hashed in the database and rotated on refresh.

## 5. Core Resources
### Properties
`GET /properties`, `POST /properties`, `GET /properties/:id`, `PATCH /properties/:id`, `DELETE /properties/:id`

### Buildings
`GET /buildings`, `POST /buildings`, `GET /buildings/:id`, `PATCH /buildings/:id`, `DELETE /buildings/:id`

### Units
`GET /units`, `POST /units`, `GET /units/:id`, `PATCH /units/:id`, `DELETE /units/:id`

### Tenants
`GET /tenants`, `POST /tenants`, `GET /tenants/:id`, `PATCH /tenants/:id`, `DELETE /tenants/:id`

### Owners
`GET /owners`, `POST /owners`, `GET /owners/:id`, `PATCH /owners/:id`, `DELETE /owners/:id`

### Leasing
- Applications: `/applications`
- Screening: `/screening`
- Leases: `/leases`
- Renewals: `/renewals`
- Move-in/out: `/move-ins`, `/move-outs`

### Rent & Payments
- `/rent/ledger`
- `/payments`
- `/invoices`
- `/charges`
- `/deposits`
- `/payment-plans`
- `/refunds`
- `/payment-methods`

All payment mutations must be idempotent and must use database transactions.

### Accounting
- `/accounting/accounts`
- `/accounting/journal-entries`
- `/accounting/general-ledger`
- `/accounting/bank-accounts`
- `/accounting/bank-reconciliation`
- `/accounting/expenses`
- `/accounting/income`
- `/accounting/vendor-bills`
- `/accounting/recurring-transactions`
- `/accounting/budgets`
- `/accounting/owner-statements`
- `/accounting/taxes`
- `/accounting/financial-reports`

### Maintenance
- `/maintenance/requests`
- `/maintenance/work-orders`
- `/maintenance/preventive`
- `/maintenance/assets`
- `/maintenance/inventory`
- `/maintenance/inspections`
- `/maintenance/vendors`
- `/maintenance/violations`

### Documents
- `/documents`
- `/documents/folders`
- `/documents/templates`
- `/documents/requests`
- `/documents/signatures`
- `/documents/versions`
- `/documents/permissions`
- `/documents/shares`
- `/documents/audit`

Uploaded files must be stored outside PostgreSQL; database stores metadata, ownership, path/key, MIME type and size.

### Communication
- `/communication/messages`
- `/communication/email`
- `/communication/sms`
- `/communication/notifications`
- `/communication/templates`
- `/communication/campaigns`
- `/communication/contacts`
- `/communication/conversations`
- `/communication/announcements`

### CRM
- `/crm/leads`
- `/crm/contacts`
- `/crm/activities`

### Reports & Analytics
- `/analytics/property`
- `/analytics/tenant`
- `/analytics/vendor-performance`
- `/reports`
- `/reports/saved`
- `/reports/scheduled`
- `/dashboards`
- `/forecasts`
- `/exports`

### Portals
Owner portal: `/owner/*`
Tenant portal: `/tenant/*`

Portal APIs must derive the owner/tenant identity from the authenticated JWT. Never trust a user-supplied ownerId or tenantId for authorization.

### Admin & Platform
- `/users`
- `/roles`
- `/assignments`
- `/companies`
- `/teams`
- `/integrations`
- `/api-keys`
- `/webhooks`
- `/audit-logs`
- `/activity`
- `/security`
- `/billing`
- `/settings`

## 6. AI APIs
AI is limited to DoorLoop/property-management workflows:
- `POST /ai/chat`
- `GET /ai/settings`
- `PATCH /ai/settings`
- `GET /ai/agents`
- `GET /ai/automations`
- `GET /ai/insights`
- `GET /ai/recommendations`
- `GET /ai/knowledge`

AI must respect tenant/company isolation, role permissions and audit logging. AI must not directly execute destructive actions without explicit authorization and a normal backend service method.

## 7. Query Conventions
List endpoints support:
`page`, `limit`, `search`, `sortBy`, `sortOrder`, filters, date ranges.

Maximum `limit` must be enforced server-side.

## 8. Security
Use Helmet, CORS allowlist, express-rate-limit, Zod or express-validator, bcrypt, JWT, UUID and centralized error handling. Never return password hashes, refresh-token hashes or secrets.
