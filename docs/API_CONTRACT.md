# DoorLoop Property Management ERP - API Contract & Interface Specification

## 1. Global Specification Rules

- **Base URL Protocol**: `https://api.doorloop-erp.com/api/v1`
- **Content Type**: `application/json` for requests and responses (`multipart/form-data` for file uploads).
- **Authentication Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Request Identification**: Incoming requests accept optional header `X-Request-ID`. If missing, the server generates a UUID v4 and returns it in the response header `X-Request-ID`.

---

## 2. Standardized JSON Envelope Format

### 2.1. Success Payload Schema (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 210,
    "totalPages": 11
  },
  "timestamp": "2026-07-27T11:30:00.000Z",
  "requestId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
}
```

### 2.2. Error Payload Schema (`400`, `401`, `403`, `404`, `409`, `422`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED_ACCESS",
    "message": "Access token has expired or is invalid.",
    "details": [
      {
        "field": "authorization",
        "issue": "Token signature mismatch"
      }
    ]
  },
  "timestamp": "2026-07-27T11:30:00.000Z",
  "requestId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
}
```

---

## 3. Query Parameter Standards

| Parameter | Type | Default | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `page` | integer | `1` | Page number for paginated endpoints. | `page=2` |
| `limit` | integer | `20` | Number of items returned per page (max 100). | `limit=50` |
| `search` | string | `null` | Full-text query string (matches name, email, address). | `search=Oakridge` |
| `sortBy` | string | `createdAt` | Field name to sort by. | `sortBy=rentAmount` |
| `sortOrder` | string | `desc` | Ordering direction (`asc` or `desc`). | `sortOrder=asc` |
| `status` | string | `null` | Filter by specific entity status. | `status=Active` |

---

## 4. Comprehensive Endpoint Catalog by Module

### 4.1. Authentication & System Administration (`/auth`, `/users`, `/roles`, `/system`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticate user & issue tokens. | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| `POST` | `/auth/refresh` | Issue new Access Token. | `{ refreshToken }` | `{ accessToken }` |
| `POST` | `/auth/logout` | Revoke user session token. | `null` | `{ success: true }` |
| `GET` | `/auth/me` | Fetch active user profile. | `null` | User object with assigned permissions |
| `GET` | `/users` | Get all system users. | `null` | Array of User objects |
| `POST` | `/users` | Create new system user. | User attributes JSON | Created User object |
| `PUT` | `/users/:id` | Update user details. | Partial User JSON | Updated User object |
| `DELETE` | `/users/:id` | Deactivate/delete user. | `null` | `{ success: true }` |
| `GET` | `/roles` | Fetch RBAC roles & permissions. | `null` | Array of Role objects |
| `POST` | `/roles` | Create custom RBAC role. | Role & permission matrix | Created Role object |
| `PUT` | `/roles/:id` | Update RBAC role permissions. | Permission matrix JSON | Updated Role object |
| `POST` | `/roles/:id/clone` | Clone existing RBAC role. | `{ newName }` | Cloned Role object |
| `GET` | `/assignments/user/:userId` | Get property/unit assignments. | `null` | User assignment arrays |
| `PUT` | `/assignments/user/:userId` | Update user assignments. | `{ properties, units, buildings }` | `{ success: true }` |
| `GET` | `/audit-logs` | Fetch system audit log trail. | Query filters | Array of AuditLog objects |

---

### 4.2. Property, Building & Unit Management (`/properties`, `/buildings`, `/units`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/properties` | Fetch all managed properties. | Pagination / search query | Array of Property objects |
| `GET` | `/properties/:id` | Fetch single property detail. | `null` | Property object |
| `POST` | `/properties` | Register new property. | `{ name, type, address, ownerId, ... }` | Created Property object |
| `PUT` | `/properties/:id` | Update property attributes. | Partial Property JSON | Updated Property object |
| `DELETE` | `/properties/:id` | Remove property record. | `null` | `{ success: true }` |
| `GET` | `/buildings` | Fetch all property buildings. | `?propertyId=prop-1` | Array of Building objects |
| `POST` | `/buildings` | Add building to property. | `{ propertyId, name, floors }` | Created Building object |
| `PUT` | `/buildings/:id` | Update building record. | Partial Building JSON | Updated Building object |
| `DELETE` | `/buildings/:id` | Remove building. | `null` | `{ success: true }` |
| `GET` | `/units` | Fetch all rental units. | Filters: `propertyId`, `status` | Array of Unit objects |
| `GET` | `/units/:id` | Fetch single unit details. | `null` | Unit object |
| `POST` | `/units` | Create new rental unit. | `{ propertyId, buildingId, unitNumber, rentAmount, ... }` | Created Unit object |
| `PUT` | `/units/:id` | Update unit configuration. | Partial Unit JSON | Updated Unit object |
| `DELETE` | `/units/:id` | Remove unit. | `null` | `{ success: true }` |

---

### 4.3. Tenants, Leases, Applications & Screening (`/tenants`, `/leases`, `/applications`, `/leads`, `/screening`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/tenants` | Fetch active/pending tenants. | Pagination & status filter | Array of Tenant objects |
| `GET` | `/tenants/:id` | Get tenant detailed profile. | `null` | Tenant object with lease history |
| `POST` | `/tenants` | Register new tenant profile. | `{ firstName, lastName, email, phone, ... }` | Created Tenant object |
| `PUT` | `/tenants/:id` | Update tenant information. | Partial Tenant JSON | Updated Tenant object |
| `DELETE` | `/tenants/:id` | Terminate tenant account. | `null` | `{ success: true }` |
| `GET` | `/leases` | List all lease contracts. | Filters: `status`, `propertyId` | Array of Lease objects |
| `GET` | `/leases/:id` | Get lease details. | `null` | Lease object |
| `POST` | `/leases` | Draft & sign new lease. | `{ tenantId, unitId, startDate, endDate, rentAmount, ... }` | Created Lease object |
| `PUT` | `/leases/:id` | Update lease terms. | Partial Lease JSON | Updated Lease object |
| `POST` | `/leases/:id/renew` | Issue lease renewal. | `{ newEndDate, newRentAmount }` | Created Renewal object |
| `GET` | `/applications` | Fetch tenant rental applications.| Filters: `status` | Array of Application objects |
| `POST` | `/applications` | Submit application. | Application JSON | Created Application object |
| `PUT` | `/applications/:id/status` | Approve or Reject application.| `{ status: 'Approved' \| 'Rejected' }` | Updated Application object |
| `GET` | `/leads` | Fetch leasing CRM leads. | Pipeline status query | Array of Lead objects |
| `POST` | `/leads` | Add new applicant lead. | `{ firstName, lastName, email, phone, ... }` | Created Lead object |
| `PUT` | `/leads/:id` | Update lead pipeline status. | `{ status: 'Tour Scheduled' }` | Updated Lead object |
| `GET` | `/screening/checks` | Fetch background checks. | Filter query | Array of ScreeningCheck objects |
| `POST` | `/screening/checks` | Trigger screening check. | `{ applicantId, screeningPackage }` | Initiated ScreeningCheck object |
| `POST` | `/screening/checks/:id/verify-income` | Perform income verification.| `{ verifiedIncome, status }` | Updated ScreeningCheck object |

---

### 4.4. Billing, Rent Payments & Ledger (`/rent`, `/payments`, `/invoices`, `/charges`, `/deposits`, `/payment-plans`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/rent/payments` | Fetch all payment records. | Filters: `tenantId`, `status` | Array of RentPayment objects |
| `POST` | `/rent/payments` | Process rent payment. | `{ tenantId, unitId, amount, paymentMethod, referenceNumber }` | Processed RentPayment object |
| `GET` | `/invoices` | List tenant billing invoices. | Filter query | Array of Invoice objects |
| `POST` | `/invoices` | Issue charge invoice. | Invoice line items JSON | Created Invoice object |
| `GET` | `/charges` | List custom billing charges. | Filter query | Array of Charge objects |
| `POST` | `/charges` | Apply one-off or recurring charge.| `{ tenantId, amount, chargeType, dueDate }` | Created Charge object |
| `GET` | `/deposits` | Security deposits ledger. | Filter query | Array of SecurityDeposit objects |
| `POST` | `/deposits/:id/refund` | Refund security deposit. | `{ refundAmount, deductions, reason }` | Deposit Refund object |
| `GET` | `/payment-plans` | Active structured payment plans.| Tenant filter | Array of PaymentPlan objects |
| `POST` | `/payment-plans` | Set up balance payment plan. | `{ tenantId, totalBalance, installments, startDate }` | Created PaymentPlan object |
| `GET` | `/rent-ledger/:tenantId` | Full tenant accounting ledger. | `null` | Itemized charges & payments balance |

---

### 4.5. Accounting, Chart of Accounts & General Ledger (`/accounting`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/accounting/accounts` | Chart of Accounts list. | `null` | Array of CoAAccount objects |
| `POST` | `/accounting/accounts` | Add account to CoA. | `{ accountCode, accountName, type }` | Created CoAAccount object |
| `GET` | `/accounting/journal-entries` | Fetch double-entry journals. | Date range filter | Array of JournalEntry objects |
| `POST` | `/accounting/journal-entries` | Post double-entry journal. | `{ date, description, lines: [{ accountId, debit, credit }] }` | Posted JournalEntry object |
| `GET` | `/accounting/general-ledger` | General ledger line items. | Filter by account / date | Array of GeneralLedgerRecord objects |
| `GET` | `/accounting/bank-accounts` | Property management bank accounts.| `null` | Array of BankAccount objects |
| `POST` | `/accounting/reconciliation` | Match bank statement records. | Reconciliation line items | Matching summary report |
| `GET` | `/accounting/expenses` | Operational expense records. | Filter query | Array of ExpenseRecord objects |
| `POST` | `/accounting/expenses` | Log expense payment. | `{ accountId, amount, vendor, date }` | Created ExpenseRecord object |
| `GET` | `/accounting/vendor-bills` | Accounts Payable vendor bills. | Status query | Array of VendorBill objects |
| `POST` | `/accounting/vendor-bills` | Post AP vendor bill. | `{ vendorId, amount, dueDate, workOrderId }` | Created VendorBill object |
| `GET` | `/accounting/owner-statements` | Monthly owner P&L statements. | Period query | Array of OwnerStatement objects |
| `GET` | `/accounting/reports/balance-sheet` | Generate Balance Sheet. | `{ asOfDate }` | Balance Sheet financial statement |
| `GET` | `/accounting/reports/income-statement` | Generate Income Statement (P&L).| `{ startDate, endDate }` | Income Statement report |

---

### 4.6. Maintenance, Work Orders & Operations (`/maintenance`, `/vendors`, `/violations`, `/inspections`, `/assets`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/maintenance/service-requests`| Tenant maintenance tickets. | Priority & status filter | Array of ServiceRequest objects |
| `POST` | `/maintenance/service-requests`| Log new service request. | `{ tenantId, unitId, title, description, priority }` | Created ServiceRequest object |
| `GET` | `/maintenance/work-orders` | Work orders list. | Vendor & status filter | Array of WorkOrder objects |
| `POST` | `/maintenance/work-orders` | Dispatch work order. | `{ propertyId, vendorId, description, estimatedCost }` | Created WorkOrder object |
| `PUT` | `/maintenance/work-orders/:id` | Update work order status. | `{ status: 'Completed', actualCost: 350 }` | Updated WorkOrder object |
| `GET` | `/vendors` | Vendor directory list. | Rating & service query | Array of Vendor objects |
| `POST` | `/vendors` | Register maintenance vendor.| `{ companyName, serviceType, email, phone }` | Created Vendor object |
| `GET` | `/maintenance/violations` | Municipal DOB/Fire violations. | Property filter | Array of Violation objects |
| `POST` | `/maintenance/violations` | Log compliance violation. | `{ violationCode, issuingAuthority, fineAmount, severity }` | Created Violation object |
| `GET` | `/maintenance/inspections` | Property inspection records. | Property filter | Array of InspectionRecord objects |
| `POST` | `/maintenance/inspections` | Schedule unit inspection. | `{ propertyId, unitId, type, inspectionDate }` | Scheduled Inspection object |
| `GET` | `/maintenance/assets` | Property asset register. | Category filter | Array of MaintenanceAsset objects |

---

### 4.7. Owner Portal & Tenant Self-Service (`/owners`, `/tenant-portal`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/owners` | Fetch registered owners. | Search query | Array of Owner objects |
| `GET` | `/owners/:id/distributions` | Owner payout distribution list. | `null` | Array of OwnerDistribution objects |
| `POST` | `/owners/:id/distributions` | Execute cash distribution payout.| `{ amount, period, payoutMethod }` | Executed Distribution object |
| `GET` | `/tenant-portal/visitors` | Registered tenant guests. | Tenant query | Array of TenantVisitor objects |
| `POST` | `/tenant-portal/visitors` | Log upcoming visitor. | `{ visitorName, visitDate, arrivalTime }` | Logged Visitor object |
| `GET` | `/tenant-portal/packages` | Logging parcel deliveries. | Tenant query | Array of TenantPackage objects |
| `POST` | `/tenant-portal/packages` | Record package arrival. | `{ carrier, trackingNumber, unitId }` | Logged Package object |
| `GET` | `/tenant-portal/insurance` | Renters insurance compliance. | Status filter | Array of InsurancePolicy objects |

---

### 4.8. Document Management System (DMS) & E-Signatures (`/dms`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/dms/documents` | Browse DMS files. | Folder ID filter | Array of DmsDocument objects |
| `POST` | `/dms/documents/upload` | Upload document file. | `multipart/form-data` | Uploaded DmsDocument object |
| `GET` | `/dms/signatures` | E-signature requests list. | Status filter | Array of DmsSignatureRequest objects |
| `POST` | `/dms/signatures` | Initiate E-signature workflow. | `{ documentId, signers: [{ email, role }] }` | Created SignatureRequest object |
| `POST` | `/dms/signatures/:id/sign` | Sign document digitally. | `{ signerEmail, signatureData }` | Completed Signature object |

---

### 4.9. Communications & Marketing Engine (`/communications`)

| HTTP Method | Route Endpoint | Description | Request Body Summary | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/communications/templates` | Email/SMS templates list. | Category filter | Array of CommTemplate objects |
| `POST` | `/communications/templates` | Create merge template. | `{ title, category, body }` | Created CommTemplate object |
| `POST` | `/communications/campaigns` | Trigger bulk broadcast. | `{ templateId, recipientRole, propertyId }` | Sent Campaign summary |
| `GET` | `/communications/messages` | Direct chat conversations. | User ID filter | Array of CommMessage objects |
