# Private payment runtime preparation

See `docs/payments/activation-design.md` for scope, risks and release gates. Sales are disabled by default and remain blocked pending the billing decision and a recoverable delivery process.

## Files

- `public/index.php`: the only served PHP entry, intended for `/api/payments/`.
- `src/Core.php`: fixed-price, verified settlement and signed license core.
- `http/PayPalHttp.php`: pinned PayPal API transport with private OAuth credentials.
- `http/Gateway.php`: same-origin session/CSRF interface; no client-supplied amount or redirect.
- `config.example.php`: empty credentials and both enablement gates false.
- `bin/initialize.php`: creates new private SQLite/session state only; refuses existing state.
- `bin/preflight.php`: non-network checks with no secret output. Live readiness intentionally remains false in this release.
- `bin/package.py`: reproducible review ZIPs and SHA-256 manifest from a clean committed source. It never deploys.

## Preparation only

1. Run CI and inspect its exact commit before packaging.
2. Run `python3 server/payments/bin/package.py --output /outside-checkout/new-review-directory`. Keep the generated private ZIP outside the served directory. Its source has no credentials, but it is not a public web asset.
3. For a later authorized sandbox installation, create a dedicated private directory outside every document root, owned by the PHP worker account, mode 0700. Extract the private ZIP there. No database/config/session/key files belong in a web root or Git.
4. Copy `config.example.php` privately to `config.php`, retain disabled flags, and configure exact sandbox identifiers through an approved secure workflow. Use a test signing key whose public half matches the test desktop. Do not reuse a fixture or development issuer for live customers.
5. Initialize empty private state with `php bin/initialize.php /absolute/private/package-root`. Copy the resulting private SQLite/session paths into private config. Config and database require 0600; sessions require 0700. Existing files are never overwritten by the initializer.
6. Register only the tiny public entry after routing review. The environment root must point to the private package, not public_html. The existing static deployment intentionally rejects PHP/API paths; do not relax its allowlist to upload private code.
7. Verify disabled catalog first. Perform a separately authorized sandbox trial only after setting exact one-time test mode and validating the delivery test setup. Never place live credentials in CI, frontend, URLs, repository files or browser storage.

No production runtime install, webhook registration, credential provisioning or live enablement is performed by these scripts. The existing automatic static publisher is unchanged.

## Required PayPal events

PAYMENT.CAPTURE.COMPLETED, PENDING, DENIED, REFUNDED, REVERSED; CUSTOMER.DISPUTE.CREATED, UPDATED, RESOLVED. Signature verification and independent API refetch are mandatory. Any supported financial hold remains blocked until a reviewed operator process resolves it. Unsupported subscription events grant nothing.

## HTTP contract

`GET ?action=catalog` returns disabled state or the validated one-time catalog and CSRF token. `GET ?action=session` returns only the current browser's sanitized order state. POST checkout accepts `term` and `installation_id` only. POST capture, license and cancel use the server-held session credential, never a return-URL token. Every browser POST requires JSON, the exact configured Origin and X-CSRF-Token. POST webhook uses PayPal's actual transmission headers and authenticated verification.

No account recovery, email delivery, subscription billing, desktop automatic refresh or Studio/Hashcat authorization bridge is implemented. Already issued offline licenses remain valid for at most one hour after a hold; immediate offline revocation is not claimed.
