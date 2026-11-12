<?php
declare(strict_types=1);
// The only PHP file intended for the public /api/payments/ directory.
// Keep the package, database, session files and config outside all document roots.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
header('X-Frame-Options: DENY');
$root = realpath(getenv('AIWORK_PAYMENTS_PRIVATE_ROOT') ?: '');
$doc = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) ?: __DIR__;
if (!$root || (fileperms($root) & 0077) !== 0 || $root === $doc || str_starts_with($root, $doc . '/') || preg_match('~(?:^|/)public_html(?:/|$)~i', $root)) {
    http_response_code(503); echo '{"error":"PAYMENTS_NOT_CONFIGURED","enabled":false}'; exit;
}
foreach (['src/Core.php', 'http/PayPalHttp.php', 'http/Gateway.php', 'config.php'] as $file) {
    $path = realpath($root . '/' . $file);
    if (!$path || !is_file($path) || !str_starts_with($path, $root . '/') || is_link($root . '/' . $file)) {
        http_response_code(503); echo '{"error":"PAYMENTS_NOT_CONFIGURED","enabled":false}'; exit;
    }
}
if ((fileperms($root . '/config.php') & 0077) !== 0) {
    http_response_code(503); echo '{"error":"PAYMENTS_NOT_CONFIGURED","enabled":false}'; exit;
}
try {
    require $root . '/src/Core.php'; require $root . '/http/PayPalHttp.php'; require $root . '/http/Gateway.php';
    $config = require $root . '/config.php';
    if (!is_array($config)) throw new RuntimeException('CONFIG_INVALID');
    \Aiwork\Payments\Gateway::serve($config, $root);
} catch (Throwable) {
    // Never return exception messages, paths, tokens, provider responses or credentials.
    http_response_code(503); echo '{"error":"PAYMENTS_UNAVAILABLE","enabled":false}';
}
