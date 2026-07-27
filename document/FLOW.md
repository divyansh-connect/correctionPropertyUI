# Backend Business Flows

## 1. Request Flow
Frontend -> API Client -> Express Router -> Auth Middleware -> Validation -> Authorization -> Controller -> Service -> Prisma -> PostgreSQL -> Response.

Controllers remain thin. Business rules belong in services.

## 2. Login Flow
1. Validate email/password.
2. Find user within company scope.
3. Compare password using bcrypt.
4. Create short-lived access JWT.
5. Create refresh token, hash it and save the hash.
6. Return access token and refresh token according to the chosen secure client strategy.

Refresh token rotation is mandatory. Logout revokes the stored refresh token.

## 3. Property Flow
Property -> Buildings -> Units -> Tenant/Lease relationships. Deleting a property must validate active leases, occupied units and financial records before allowing deletion or soft deletion.

## 4. Tenant & Lease Flow
Tenant application -> screening -> approval -> lease creation -> unit occupancy -> rent charges -> payments -> renewal or move-out.

## 5. Rent Payment Flow
1. Calculate outstanding balance from charges and posted payments.
2. If balance is zero, payment creation is rejected.
3. Create payment with idempotency protection.
4. Update ledger in a database transaction.
5. Record audit event.

## 6. Accounting Flow
Operational event -> financial transaction -> journal entry -> journal lines -> ledger/reporting. Posted entries are not silently edited.

## 7. Maintenance Flow
Tenant/staff creates request -> triage -> assignment -> work order -> vendor/technician work -> inspection/completion -> invoice -> close. Every important status change is audited.

## 8. Document Flow
Upload -> validate file size/type -> store file -> create metadata -> permissions -> optional version -> optional signature request -> audit.

Existing UI upload limit rules, including tenant/owner 5MB upload flows, must remain enforced by the backend.

## 9. Owner Portal Flow
JWT identifies owner -> backend verifies owner relationship -> only owned properties, statements, distributions, documents, maintenance and messages are returned.

## 10. Tenant Portal Flow
JWT identifies tenant -> backend verifies tenant relationship -> only that tenant's lease, unit, payments, documents, maintenance, visitors, packages, insurance, announcements and support tickets are returned.

## 11. Communication Flow
Create message/email/SMS/notification -> validate recipient and company scope -> queue/send through provider abstraction -> save delivery status -> audit.

## 12. AI Flow
User question -> authenticate -> authorize -> classify property-management intent -> retrieve permitted data -> generate answer -> optionally propose action -> require explicit confirmation for mutations -> execute existing service -> audit.

AI must not bypass normal authorization or directly write arbitrary database records.

## 13. Frontend Migration Rule
The current `src/api/mockApi.ts` is the behavior reference. Backend endpoint names and response shapes should map to existing service groups so frontend workflows remain unchanged. Do not redesign the UI as part of backend implementation.
