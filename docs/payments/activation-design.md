# AIWORK payment-to-activation design

## State of this change

This is a **disabled implementation and deployment-preparation branch**, not an active sales launch. No real PayPal product, subscription, payment, webhook registration, production key, customer record or hosting change is created by this source.

The approved display prices are USD 18 for one month, USD 108 for six months and USD 216 for twelve months. Whether these are recurring subscriptions or one-time access passes remains undecided. `mode` therefore defaults to `null`. The implemented provider path requires an explicit `one_time` configuration. `recurring` is deliberately rejected, not silently treated as a one-time sale.

The existing homepage checkout URLs remain null. The new `/activate/` page starts closed and requires an enabled, validated same-origin server catalog. Publishing static files does not configure the payment server.

## Architecture and trust boundary

- Static Next frontend: `/activate/`, with repeated-click protection and no price, return URL or license-state authority.
- Public PHP entry: `/api/payments/index.php` only. It locates a separately installed private package through `AIWORK_PAYMENTS_PRIVATE_ROOT` and refuses public-root configuration.
- Private PHP 8.2+ service: `server/payments/src/Core.php`, pinned PayPal REST transport, SQLite ledger, PHP file sessions and Ed25519 signer. Bluehost PHP 8.3, PDO SQLite and sodium availability were separately observed; this package has not been installed there.
- Checkout state contains installation ID, fixed term, random internal ID, provider order/capture IDs, token hash and status. No PayPal payer email/address or card data is persisted.
- A random delivery credential stays in a Secure, HttpOnly, SameSite=Lax PHP session; its ledger copy is only SHA-256. It is never included in return URLs, client storage, provider metadata or logs.
- Existing membership tables and Google sessions are not modified. This slice is a guest, installation-bound checkout. Authenticated account linking and cross-product access are separate release work, not implied by this implementation.

## One-time path, when explicitly configured for testing

1. Customer copies the 32-hex installation ID from the AIWORK desktop Pro panel and selects a fixed term.
2. Server creates a PayPal CAPTURE order with the exact USD amount, one digital item, configured merchant and unique internal metadata. Redirects are fixed to the configured site's `/activate/` page.
3. Customer authorizes in PayPal. Returning to the site does **not** activate anything. The server refetches the order and verifies amount, currency, merchant, item/SKU, quantity and internal binding before capture.
4. A verified `PAYMENT.CAPTURE.COMPLETED` webhook is required. PayPal's authenticated signature-verification API must return SUCCESS; the service independently refetches order/capture state and verifies final settled status and binding.
5. Unique event IDs, transactional updates and sticky holds prevent duplicate or late events from extending or restoring access. An uncertain capture retry reuses the same PayPal request ID.
6. Only then can the customer download a signed envelope for that installation. The issued payload matches the desktop verifier: version, product, plan, license ID, installation ID, issuance/expiry, project allowance and paid kind.

A local cancel is allowed only while the provider order is CREATED/SAVED and the local order remains pending. It does not refund or cancel an approved payment. Approved/captured orders awaiting webhook retain their session and require reconciliation, preventing a paid-but-cleared-session failure.

## Expiry, refund and dispute model

Paid entitlement lasts the exact selected number of calendar months in UTC, clamping end-of-month dates. Issued licenses are renewable leases of at most one hour, bounded by the paid expiry. Every reissue checks provider state and the latest local hold. Network requests run outside SQLite's writer lock; final issuance reloads/rechecks holds under lock.

Verified refund, denial, reversal or dispute events put the entitlement on a sticky hold. Any partial refund also stops renewal. Dispute resolution does not automatically restore access; an operator must reconcile the outcome. No refund or money-movement operation is implemented.

An already issued offline license cannot be instantly recalled. It may remain valid until its one-hour lease expires. **Automatic desktop refresh is not implemented in this branch.** The preparation UI supports manual redownload in the same browser session only. This is unsuitable for live sales until automatic refresh and recoverable account ownership are implemented and tested. The private preflight intentionally reports `ready_for_live_sales: false`.

## HTTP controls

The HTTP adapter has bounded JSON bodies, method allowlists, fixed same-origin redirects, CSRF validation, cookie-only strict sessions, HMAC-pseudonymized per-IP rate buckets, no permissive CORS, TLS-only PayPal transport, certificate validation, no redirects, bounded responses and timeouts. Transport error details and credentials are not exposed. A webhook uses actual server headers; caller-supplied body headers are ignored. No arbitrary certificate URL is fetched.

The public API remains off unless both `enabled` and `customer_delivery_ready` are explicitly true. Setting flags is not a substitute for actual readiness or owner authorization. Missing configuration, signing-key mismatch, unsupported billing mode, failed provider checks or inaccessible private storage fail closed.

## Release gates not completed

1. Owner selects recurring versus fixed-period billing. If recurring is selected, implement PayPal product/plan/subscription mapping and recurring payment verification separately. A subscription activation event alone must not grant a paid term.
2. Confirm the commercial project allowance, public installer availability, licensing terms, tax/refund/support policy and exact fulfillment promise.
3. Create/store production signing material privately through an authorized credential workflow; compile the matching public key into a distributable desktop build. No production keys are generated here.
4. Implement automatic lease refresh and recoverable account/order ownership. Cookie deletion or switching browsers currently loses self-service access. Do not sell until a recovery path exists.
5. Implement product-specific entitlement linking for Studio/Hashcat. A desktop license is not proof of cross-product activation.
6. Run real PayPal sandbox order, approval, capture, webhook retry, decline, refund, dispute and lost-session tests with the actual merchant configuration. Current tests use synthetic fixtures, not PayPal sandbox calls.
7. Install and verify the private runtime and webhook separately from the static GitHub release. Verify HTTPS routing, session/storage permissions, clock, monitoring, backup and receipt reconciliation.
8. Obtain a launch decision before any live charge. Preserve disabled state until every material gate is met.

## Validation

- PHP standalone tests: `php server/payments/tests/run.php`.
- HTTP/transport fail-closed tests: `php server/payments/http/test.php`.
- Example preflight: `php server/payments/bin/preflight.php --example`.
- Source/package scan: `python3 server/payments/bin/check_package.py`.
- Site: Node 24, locked dependencies, static build, complete existing regression suite, new activation tests, TypeScript and scoped ESLint.
- GitHub workflow `Payment activation readiness` runs checks only on the preparation branch and pull requests. It contains no production secrets and no deployment action.

Tests validate synthetic provider contracts and local security logic. They do not establish compatibility with a live merchant or end-to-end production delivery.
