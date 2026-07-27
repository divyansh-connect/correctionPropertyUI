# DoorLoop Property Management ERP - Business Rules & Logic Specification

## 1. Property, Building & Unit Governance

### 1.1. Occupancy & Metric Calculation Formulas
Every modification to a Unit's status (`Occupied`, `Vacant`, `Reserved`, `Under Maintenance`) dynamically recalculates metrics on both the parent `Building` and parent `Property` records via database triggers or Prisma middleware:

$$\text{Occupancy Rate (\%)} = \left( \frac{\text{Count of Units with status } \texttt{'Occupied'}}{\text{Total Units Count}} \right) \times 100$$

$$\text{Monthly Revenue (\$)} = \sum_{u \in \text{Occupied Units}} \text{Unit.rentAmount}_u$$

### 1.2. Status Invariants
- A Unit **cannot** be marked as `Occupied` without an active `Lease` contract linked to a valid `Tenant`.
- Deleting a `Property` is **strictly blocked** if there are existing active `Leases`, open `WorkOrders`, or unallocated `SecurityDeposits`. Properties must be archived (`status: 'Inactive'`) instead.

---

## 2. Leasing, Applicants & Screening Lifecycle

```mermaid
stateDiagram-v8
    [*] --> LeadCreated: Applicant inquiry logged
    LeadCreated --> ApplicationSubmitted: Lead applies for Unit
    ApplicationSubmitted --> BackgroundScreening: Trigger TransUnion check
    
    state BackgroundScreening {
        [*] --> CreditCheck
        [*] --> CriminalCheck
        [*] --> EvictionCheck
        [*] --> IncomeVerification
    }

    BackgroundScreening --> Approved: Credit Score >= 650 & Income >= 3x Rent
    BackgroundScreening --> Rejected: Fails screening policy
    
    Approved --> LeaseDrafted: Issue Lease contract
    LeaseDrafted --> LeaseSigned: Digital E-Signature executed
    LeaseSigned --> ActiveLease: Security Deposit + 1st Month Rent Paid
    ActiveLease --> [*]
```

### 2.1. Background Screening Eligibility & Recommendation Rules
- **Credit Score Thresholds**:
  - Score $\ge 680$: Recommended `Approved` with standard deposit.
  - Score $600 - 679$: Recommended `Conditional Approval` (requires 1.5x Security Deposit or Co-signer).
  - Score $< 600$: Recommended `Rejected`.
- **Income Multiplier**: Verified Gross Monthly Income MUST be $\ge 3.0 \times \text{Monthly Rent}$.
- **Criminal & Eviction Red Lines**: Any active eviction records within 7 years automatically flag the application for `Manual Manager Review`.

### 2.2. Security Deposit Handling Rules
- Security deposits are held in dedicated **Escrow Liability Accounts** (`Liability - Security Deposits`).
- Security deposit funds **cannot** be mixed with property operational revenue bank accounts.
- Upon move-out inspection, deductions for tenant damages must be itemized within 30 days. The refund calculation is:

$$\text{Refund Amount} = \text{Initial Deposit} - \sum \text{Itemized Damage Charges} - \sum \text{Unpaid Balance}$$

---

## 3. Financial, Payments & Double-Entry Accounting Rules

### 3.1. Fundamental Double-Entry Accounting Constraint
Every financial transaction logged into the system via `JournalEntry` must satisfy the core double-entry accounting identity. Transactions failing this rule are **rejected** with HTTP `422 Unprocessable Entity`:

$$\sum \text{Debit Amounts} = \sum \text{Credit Amounts}$$

$$\text{Assets} = \text{Liabilities} + \text{Owner's Equity}$$

### 3.2. Rent Payment Allocation Waterfall
When a payment is received from a tenant, the backend automatically applies the incoming funds against open tenant ledger charges in strict waterfall priority:

1. **Past-Due Utility / Maintenance Charges** (Oldest to newest)
2. **Outstanding Late Fees**
3. **Current Month Rent Charge**
4. **Future Pre-payments / Credit Adjustments**

### 3.3. Late Fee Business Rules
- Rent is due on the **1st day** of each month.
- Grace period extends through the **5th day** of the month.
- On the **6th day** at 00:01 AM server time, an automated cron job evaluates unpaid leases:
  - Fixed Fee: $\$50.00$ flat fee OR $5\%$ of monthly rent (whichever is greater).
  - Daily Accrual (optional per lease terms): $\$10.00 / \text{day}$ up to a maximum cap of $\$200.00$.

### 3.4. Owner Distribution Calculation Formula
Monthly payouts dispatched to property owners on the 25th of each month are calculated as:

$$\text{Net Distribution} = \text{Total Collected Rental Revenue} - \text{Property Operating Expenses} - \text{Vendor AP Bills Paid} - \text{Management Fee (e.g. 8\%)} - \text{Reserve Retention Fund}$$

---

## 4. Maintenance, Work Orders & Compliance Rules

### 4.1. Work Order Cost Approval Caps
- Work orders created with `estimatedCost` $\le \$500.00$ can be directly assigned to vendors by Property Managers.
- Work orders with `estimatedCost` $> \$500.00$ require **Owner Approval** (`status: Pending Approval`) before work order dispatch.

### 4.2. Code Violation Remediation Timelines
- **Critical Severity** (e.g. Fire hazards, structural failures): Remediation required within **7 days**.
- **Warning Severity** (e.g. Minor health notices): Remediation required within **30 days**.

---

## 5. Security & Role-Based Access Control (RBAC) Enforcements

### 5.1. Capability Verification Matrix
Before executing any controller action, the backend `rbac.middleware` evaluates the user's role permissions against the requested module and action:

```typescript
function checkPermission(userRole: Role, module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export'): boolean {
  const perm = userRole.permissions.find(p => p.module === module);
  if (!perm) return false;
  return perm[action] === true;
}
```

### 5.2. Scope Assignment Enforcements
- If a user has property assignment restrictions (`user_assignments` table), all database queries automatically append `WHERE propertyId IN (...assignedIds)`.
- Super Admin accounts bypass scope filters and have global access across all properties, tenants, and company accounts.

---

## 6. Document Management & E-Signature Audit Rules

- Signed contracts stored in DMS cannot be modified or replaced. Any changes require creating a new file version (`DmsFileVersion`).
- E-Signature workflows create an immutable audit trail capturing: IP Address, User Agent, Timestamp, Digital Signature Hash, and Signer Verification Method.
