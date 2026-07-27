# Database Schema Specification

## 1. Database
- PostgreSQL
- Prisma ORM
- UUID primary keys
- UTC timestamps: `createdAt`, `updatedAt`
- Soft delete where business history must be preserved: `deletedAt`

## 2. Multi-Tenant Boundary
Every business record must belong to a `Company`/workspace directly or through a relation. Every service query must apply the authenticated `companyId` scope.

## 3. Core Models
### User
`id, companyId, email, passwordHash, firstName, lastName, phone, status, lastLoginAt, createdAt, updatedAt`

### Role / Permission / UserRole
RBAC supports Super Admin, Property Manager/Staff, Owner and Tenant. Permissions must be explicit and checked in middleware/service layer.

### RefreshToken
`id, userId, tokenHash, expiresAt, revokedAt, replacedByTokenId, userAgent, ipAddress`

### Company
`id, name, email, phone, currency, timezone, settingsJson`

### Property
`id, companyId, ownerId, name, type, status, address fields, yearBuilt, purchasePrice, currentValue, monthlyExpenses`

### Building
`id, propertyId, name, floors`

### Unit
`id, propertyId, buildingId, unitNumber, floor, bedrooms, bathrooms, squareFootage, rentAmount, securityDeposit, status, availabilityDate`

### Owner
`id, userId, companyId, contact details, payoutMethod`

### Tenant
`id, userId, companyId, contact details, status`

### Lease
`id, tenantId, unitId, startDate, endDate, rentAmount, securityDeposit, status, terms`

### Application / ScreeningCheck / Renewal
Application and screening records must be linked to the applicant, property/unit and company. Renewal must reference the original lease.

## 4. Finance Models
- RentPayment
- Invoice
- Charge
- SecurityDeposit
- PaymentPlan
- Refund
- Transaction
- ChartOfAccount
- JournalEntry
- JournalEntryLine
- GeneralLedgerRecord
- BankAccount
- Expense
- Income
- VendorBill
- RecurringTransaction
- Budget
- OwnerStatement
- TaxRate

Financial records must be immutable or reversal-based after posting. Do not silently overwrite posted accounting transactions.

## 5. Maintenance Models
- MaintenanceRequest
- WorkOrder
- PreventiveTask
- MaintenanceAsset
- InventoryItem
- InspectionRecord
- Violation
- Vendor
- VendorInvoice

Work order status changes must be auditable.

## 6. Document Models
- Document
- DocumentFolder
- DocumentTemplate
- DocumentRequest
- SignatureRequest
- FileVersion
- DocumentPermission
- DocumentShare
- DocumentAuditRecord

Store file metadata in PostgreSQL and the actual binary in a configured storage provider/local storage abstraction.

## 7. Communication Models
- Message
- Email
- SMS
- Notification
- Template
- Campaign
- Contact
- Conversation
- Announcement
- Activity

## 8. Reporting Models
- PropertyAnalyticsRecord
- TenantAnalyticsRecord
- VendorPerformanceRecord
- ReportDefinition
- SavedReport
- ScheduledReport
- CustomDashboard
- ExportRecord
- ForecastDataPoint

## 9. Audit
`AuditLog(id, companyId, userId, action, entityType, entityId, beforeJson, afterJson, ipAddress, userAgent, createdAt)`

Audit logs are append-only.

## 10. Indexes
Create indexes for:
- `(companyId)` on all tenant-scoped tables
- email unique per appropriate scope
- foreign keys
- status fields used in dashboards
- dates used in reports and ledgers
- searchable names/emails

## 11. Prisma Rules
Use Prisma migrations. Never use `db push` as the production schema-management strategy. Seed data must be deterministic and must not be used as a replacement for production records.
