<?php
declare(strict_types=1);
namespace Aiwork\Payments;

final class Gateway
{
    public static function serve(array $settings, string $root): never
    {
        $action = $_GET['action'] ?? 'catalog';
        $method = $_SERVER['REQUEST_METHOD'] ?? '';
        if (!is_string($action) || !in_array($action, ['catalog', 'session', 'checkout', 'capture', 'license', 'cancel', 'webhook'], true)) self::reply(404, ['error'=>'NOT_FOUND']);
        if (!in_array($method, in_array($action, ['catalog', 'session'], true) ? ['GET'] : ['POST'], true)) self::reply(405, ['error'=>'METHOD_NOT_ALLOWED']);
        if (($settings['enabled'] ?? false) !== true || ($settings['customer_delivery_ready'] ?? false) !== true) {
            self::reply($action === 'catalog' ? 200 : 503, ['enabled'=>false, 'billing_mode'=>null, 'terms'=>[], 'error'=>'CHECKOUT_DISABLED']);
        }
        $origin = (string)($settings['origin'] ?? '');
        if (!preg_match('~^https://[a-z0-9.-]+(?::[0-9]{1,5})?$~D', $origin) || !in_array($settings['environment'] ?? '', ['sandbox', 'live'], true)) throw new \RuntimeException('CONFIG_INVALID');
        foreach (['return_url', 'cancel_url'] as $key) if (($settings[$key] ?? '') !== $origin . '/activate/') throw new \RuntimeException('REDIRECT_CONFIG_INVALID');
        $configuration = Config::fromArray($settings); $configuration->assertReady();
        $database = self::privateFile((string)($settings['database_path'] ?? ''), $root);
        $sessions = realpath((string)($settings['session_path'] ?? ''));
        if (!$sessions || !is_dir($sessions) || !str_starts_with($sessions, $root . '/') || (fileperms($sessions) & 0077) !== 0) throw new \RuntimeException('SESSION_CONFIG_INVALID');
        $key = $settings['rate_limit_key'] ?? '';
        if (!is_string($key) || strlen($key) < 32) throw new \RuntimeException('RATE_LIMIT_CONFIG_INVALID');
        $pdo = new \PDO('sqlite:' . $database, null, null, [\PDO::ATTR_ERRMODE=>\PDO::ERRMODE_EXCEPTION]);
        $pdo->exec('PRAGMA busy_timeout=5000');
        self::rateLimit($pdo, $key, $action);
        $service = new PaymentService($configuration, new Store($pdo), new PayPalHttp((string)($settings['client_id'] ?? ''), (string)($settings['client_secret'] ?? ''), $settings['environment']), fn()=>time());
        if ($action === 'webhook') {
            $body = self::body(262144);
            $headers = [];
            foreach (['PAYPAL-AUTH-ALGO', 'PAYPAL-CERT-URL', 'PAYPAL-TRANSMISSION-ID', 'PAYPAL-TRANSMISSION-SIG', 'PAYPAL-TRANSMISSION-TIME'] as $name) {
                $value = $_SERVER['HTTP_' . str_replace('-', '_', $name)] ?? '';
                if (!is_string($value) || $value === '' || strlen($value) > 8192 || preg_match('/[\r\n]/', $value)) self::reply(400, ['error'=>'WEBHOOK_HEADERS_INVALID']);
                $headers[strtolower($name)] = $value;
            }
            $result = $service->webhook($headers, $body); self::reply(200, ['received'=>true, 'result'=>$result]);
        }
        // Fetches from the static page are same-origin. Cross-site forms never reach state changes.
        if ($method === 'POST' && ($_SERVER['HTTP_ORIGIN'] ?? '') !== $origin) self::reply(403, ['error'=>'ORIGIN_REJECTED']);
        if (isset($_SERVER['HTTP_SEC_FETCH_SITE']) && !in_array($_SERVER['HTTP_SEC_FETCH_SITE'], ['same-origin', 'none'], true)) self::reply(403, ['error'=>'ORIGIN_REJECTED']);
        if (session_status() === PHP_SESSION_ACTIVE) throw new \RuntimeException('SESSION_ALREADY_ACTIVE');
        ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1'); ini_set('session.gc_maxlifetime', '172800');
        session_name('aiwork_payment_session'); session_save_path($sessions);
        session_set_cookie_params(['lifetime'=>0, 'path'=>'/api/payments/', 'secure'=>true, 'httponly'=>true, 'samesite'=>'Lax']);
        if (!session_start()) throw new \RuntimeException('SESSION_FAILED');
        if (!isset($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
        if ($action === 'catalog') self::reply(200, ['enabled'=>true, 'environment'=>$settings['environment'], 'billing_mode'=>'one_time', 'csrf'=>$_SESSION['csrf'], 'terms'=>[
            ['id'=>'monthly','months'=>1,'amount'=>'18.00','currency'=>'USD'], ['id'=>'half_year','months'=>6,'amount'=>'108.00','currency'=>'USD'], ['id'=>'yearly','months'=>12,'amount'=>'216.00','currency'=>'USD'],
        ]]);
        if ($method === 'POST') {
            $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            if (!is_string($csrf) || !hash_equals($_SESSION['csrf'], $csrf)) self::reply(403, ['error'=>'CSRF_REJECTED']);
        }
        $body = $method === 'POST' ? self::body(4096) : [];
        if ($action === 'checkout') {
            if (isset($_SESSION['payment'])) self::reply(409, ['error'=>'EXISTING_PAYMENT_SESSION']);
            $term = $body['term'] ?? ''; $installation = $body['installation_id'] ?? '';
            if (!is_string($term) || !in_array($term, ['monthly','half_year','yearly'], true) || !is_string($installation) || !preg_match('/^[a-f0-9]{32}$/D', $installation)) self::reply(400, ['error'=>'INPUT_INVALID']);
            $order = $service->createOrder($term, $installation);
            $_SESSION['payment'] = ['order_id'=>$order['order_id'], 'delivery_token'=>$order['delivery_token'], 'installation_id'=>$installation, 'term'=>$term];
            session_regenerate_id(true);
            self::reply(201, ['approval_url'=>$order['approval_url']]);
        }
        $payment = $_SESSION['payment'] ?? null;
        if (!is_array($payment)) self::reply($action === 'session' ? 200 : 409, ['has_payment'=>false, 'error'=>'NO_PAYMENT_SESSION']);
        if ($action === 'session') self::reply(200, ['has_payment'=>true, 'payment'=>$service->status($payment['delivery_token'])]);
        if ($action === 'capture') { $result=$service->captureOrder($payment['order_id'], $payment['delivery_token']); self::reply(200, ['result'=>$result, 'payment'=>$service->status($payment['delivery_token'])]); }
        if ($action === 'cancel') { $result=$service->cancelOrder($payment['order_id'], $payment['delivery_token']); unset($_SESSION['payment']); self::reply(200, ['result'=>$result]); }
        if ($action === 'license') self::reply(200, ['license'=>$service->issueLicense($payment['delivery_token'], $payment['installation_id'])]);
        self::reply(404, ['error'=>'NOT_FOUND']);
    }
    private static function privateFile(string $path, string $root): string
    {
        $file = realpath($path);
        if (!$file || !is_file($file) || is_link($path) || !str_starts_with($file, $root . '/') || (fileperms($file) & 0077) !== 0) throw new \RuntimeException('DATABASE_CONFIG_INVALID');
        return $file;
    }
    private static function body(int $limit): array
    {
        if (!preg_match('~^application/json(?:\s*;|$)~i', $_SERVER['CONTENT_TYPE'] ?? '')) self::reply(415, ['error'=>'JSON_REQUIRED']);
        if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > $limit) self::reply(413, ['error'=>'BODY_TOO_LARGE']);
        $stream=fopen('php://input','rb'); $raw=stream_get_contents($stream,$limit+1); fclose($stream);
        if ($raw === false || strlen($raw)>$limit) self::reply(413, ['error'=>'BODY_TOO_LARGE']);
        try { $body=json_decode($raw,true,32,JSON_THROW_ON_ERROR); } catch (\JsonException) { self::reply(400,['error'=>'JSON_INVALID']); }
        if (!is_array($body)) self::reply(400,['error'=>'JSON_INVALID']); return $body;
    }
    private static function rateLimit(\PDO $pdo, string $key, string $action): void
    {
        // Schema is provisioned by the offline initializer, never by an incoming request.
        $now=time(); $bucket=intdiv($now,60); $ip=(string)($_SERVER['REMOTE_ADDR']??'unknown');
        $identity=hash_hmac('sha256',$ip,$key); $limit=$action==='checkout'?5:($action==='webhook'?120:60);
        $pdo->exec('BEGIN IMMEDIATE');
        try {
            $q=$pdo->prepare('INSERT INTO payment_http_limits(identity,action,bucket,count) VALUES(?,?,?,1) ON CONFLICT(identity,action,bucket) DO UPDATE SET count=count+1'); $q->execute([$identity,$action,$bucket]);
            $q=$pdo->prepare('SELECT count FROM payment_http_limits WHERE identity=? AND action=? AND bucket=?');$q->execute([$identity,$action,$bucket]);$count=(int)$q->fetchColumn();
            $q=$pdo->prepare('DELETE FROM payment_http_limits WHERE bucket<?');$q->execute([$bucket-2]);$pdo->exec('COMMIT');
        } catch (\Throwable $e) { $pdo->exec('ROLLBACK'); throw $e; }
        if ($count>$limit) { header('Retry-After: 60'); self::reply(429,['error'=>'RATE_LIMITED']); }
    }
    private static function reply(int $status, array $data): never
    {
        http_response_code($status); echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR); exit;
    }
}
