<?php
declare(strict_types=1);
namespace Aiwork\Payments;

use DateTimeImmutable;
use DateTimeZone;
use PDO;
use RuntimeException;
use Throwable;

/** Fixed-origin OAuth transport; TLS validation, bounded responses/timeouts, no redirects. */
interface PayPal {
    public function request(string $method, string $path, ?array $body = null, ?string $requestId = null): array;
}
final class PaymentException extends RuntimeException {}

final readonly class Config {
    private function __construct(public array $values) {}
    public static function fromArray(array $values): self {
        return new self($values + ['enabled'=>false,'mode'=>null,'merchant_id'=>'','webhook_id'=>'',
            'signing_secret_key_hex'=>'','app_public_key_hex'=>'','lease_seconds'=>3600,'max_projects'=>2,
            'return_url'=>'','cancel_url'=>'','environment'=>'sandbox']);
    }
    public function get(string $key): mixed { return $this->values[$key] ?? null; }
    public function assertReady(): void {
        if ($this->get('enabled') !== true) { throw new PaymentException('payments_disabled'); }
        if (!in_array($this->get('environment'), ['sandbox','live'], true)) { throw new PaymentException('invalid_provider_environment'); }
        if ($this->get('mode') !== 'one_time') { throw new PaymentException('billing_mode_not_supported_or_undecided'); }
        if (!preg_match('/^[A-Z0-9]{5,64}$/D', (string)$this->get('merchant_id')) || !$this->get('webhook_id')) {
            throw new PaymentException('provider_configuration_missing');
        }
        if (!extension_loaded('sodium') || !preg_match('/^[0-9a-f]{128}$/D', (string)$this->get('signing_secret_key_hex'))
            || !preg_match('/^[0-9a-f]{64}$/D', (string)$this->get('app_public_key_hex'))) {
            throw new PaymentException('signing_configuration_missing');
        }
        $secret = hex2bin($this->get('signing_secret_key_hex'));
        $public = sodium_crypto_sign_publickey_from_secretkey($secret);
        if (!hash_equals($this->get('app_public_key_hex'), bin2hex($public))
            || !sodium_crypto_sign_verify_detached(sodium_crypto_sign_detached('readiness', $secret), 'readiness', $public)) {
            throw new PaymentException('app_public_key_mismatch');
        }
        foreach (['lease_seconds'=>[60,3600], 'max_projects'=>[2,100]] as $key=>$bounds) {
            $n=$this->get($key);
            if (!is_int($n) || $n<$bounds[0] || $n>$bounds[1]) { throw new PaymentException('invalid_license_configuration'); }
        }
        foreach (['return_url','cancel_url'] as $key) {
            $url=$this->get($key);
            if (!is_string($url) || !filter_var($url,FILTER_VALIDATE_URL) || parse_url($url,PHP_URL_SCHEME)!=='https'
                || parse_url($url,PHP_URL_USER)!==null || parse_url($url,PHP_URL_FRAGMENT)!==null) {
                throw new PaymentException('invalid_return_url');
            }
        }
    }
    public static function term(string $key): array {
        return match($key) {
            'monthly'=>['months'=>1,'value'=>'19.00','currency_code'=>'USD','sku'=>'aiwork-browser-pro-1m'],
            'half_year'=>['months'=>6,'value'=>'114.00','currency_code'=>'USD','sku'=>'aiwork-browser-pro-6m'],
            'yearly'=>['months'=>12,'value'=>'228.00','currency_code'=>'USD','sku'=>'aiwork-browser-pro-12m'],
            default=>throw new PaymentException('unknown_term'),
        };
    }
}

/** Private SQLite storage. Migrate from private CLI, never a public HTTP request. */
final class Store {
    public function __construct(public readonly PDO $db) {
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME)!=='sqlite') { throw new PaymentException('sqlite_required'); }
        $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);
        $db->exec('PRAGMA busy_timeout=5000'); $db->exec('PRAGMA foreign_keys=ON');
    }
    public function migrate(): void {
        $this->db->exec('CREATE TABLE IF NOT EXISTS orders (
            local_id TEXT PRIMARY KEY, order_id TEXT UNIQUE, capture_id TEXT UNIQUE,
            token_hash TEXT NOT NULL UNIQUE, installation_id TEXT NOT NULL, term TEXT NOT NULL,
            status TEXT NOT NULL, created_at INTEGER NOT NULL, paid_at INTEGER, expires_at INTEGER,
            denied INTEGER NOT NULL DEFAULT 0, license_id TEXT NOT NULL UNIQUE
        ); CREATE TABLE IF NOT EXISTS events (event_id TEXT PRIMARY KEY,event_type TEXT NOT NULL,processed_at INTEGER NOT NULL)');
    }
    public function transaction(callable $fn): mixed {
        $this->db->exec('BEGIN IMMEDIATE');
        try { $result=$fn(); $this->db->exec('COMMIT'); return $result; }
        catch(Throwable $e) { $this->db->exec('ROLLBACK'); throw $e; }
    }
    public function one(string $sql,array $args): ?array {
        $q=$this->db->prepare($sql); $q->execute($args); $row=$q->fetch(); return $row===false ? null : $row;
    }
    public function run(string $sql,array $args): void { $q=$this->db->prepare($sql); $q->execute($args); }
}

final class PaymentService {
    private \Closure $clock;
    public function __construct(private Config $config,private Store $store,private PayPal $paypal,?callable $clock=null) {
        $this->clock=$clock===null ? static fn(): int=>time() : \Closure::fromCallable($clock);
    }
    private function now(): int { return ($this->clock)(); }
    private function ready(): void { $this->config->assertReady(); }
    private static function id(mixed $id): string {
        if (!is_string($id)||!preg_match('/^[A-Za-z0-9_-]{1,128}$/D',$id)) { throw new PaymentException('invalid_provider_id'); }
        return $id;
    }
    private static function installation(string $id): void {
        if (!preg_match('/^[0-9a-f]{32}$/D',$id)) { throw new PaymentException('invalid_installation_id'); }
    }
    private static function timestamp(mixed $value): int {
        if (!is_string($value)||!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/D',$value)) {
            throw new PaymentException('invalid_provider_timestamp');
        }
        try { $date=new DateTimeImmutable($value); } catch(Throwable) { throw new PaymentException('invalid_provider_timestamp'); }
        $errors=DateTimeImmutable::getLastErrors();
        if ($errors!==false && ($errors['warning_count']||$errors['error_count'])) { throw new PaymentException('invalid_provider_timestamp'); }
        return $date->getTimestamp();
    }
    /** Return token once to trusted HTTP adapter; never URLs, browser storage, logs or PayPal metadata. */
    public function createOrder(string $termKey,string $installationId): array {
        $this->ready(); self::installation($installationId); $term=Config::term($termKey);
        $local=bin2hex(random_bytes(16)); $token=bin2hex(random_bytes(32));
        $this->store->run('INSERT INTO orders(local_id,token_hash,installation_id,term,status,created_at,license_id) VALUES(?,?,?,?,?,?,?)',
            [$local,hash('sha256',$token),$installationId,$termKey,'creating',$this->now(),'lic_'.bin2hex(random_bytes(16))]);
        $order=$this->paypal->request('POST','/v2/checkout/orders',[
            'intent'=>'CAPTURE','purchase_units'=>[[
                'reference_id'=>$local,'custom_id'=>$local,'invoice_id'=>$local,
                'payee'=>['merchant_id'=>$this->config->get('merchant_id')],
                'amount'=>['currency_code'=>'USD','value'=>$term['value'],'breakdown'=>['item_total'=>['currency_code'=>'USD','value'=>$term['value']]]],
                'items'=>[['name'=>'AIWORK Pro '.$term['months'].' months','sku'=>$term['sku'],'quantity'=>'1','category'=>'DIGITAL_GOODS',
                    'unit_amount'=>['currency_code'=>'USD','value'=>$term['value']]]],
            ]], 'payment_source'=>['paypal'=>['experience_context'=>[
                'shipping_preference'=>'NO_SHIPPING','user_action'=>'PAY_NOW','return_url'=>$this->config->get('return_url'),'cancel_url'=>$this->config->get('cancel_url'),
            ]]],
        ],'cr-'.$local);
        $id=self::id($order['id']??null); $approval=null;
        foreach ($order['links']??[] as $link) {
            $url=$link['href']??'';
            if (in_array($link['rel']??'',['approve','payer-action'],true) && is_string($url)
                && parse_url($url,PHP_URL_SCHEME)==='https'
                && parse_url($url,PHP_URL_HOST)===($this->config->get('environment')==='live' ? 'www.paypal.com' : 'www.sandbox.paypal.com')
                && parse_url($url,PHP_URL_PATH)==='/checkoutnow' && parse_url($url,PHP_URL_QUERY)==='token='.$id
                && parse_url($url,PHP_URL_USER)===null && parse_url($url,PHP_URL_PASS)===null
                && parse_url($url,PHP_URL_PORT)===null && parse_url($url,PHP_URL_FRAGMENT)===null) { $approval=$url; }
        }
        if ($approval===null) { throw new PaymentException('missing_provider_approval_url'); }
        $this->store->run('UPDATE orders SET order_id=?,status=? WHERE local_id=?',[$id,'pending',$local]);
        return ['order_id'=>$id,'approval_url'=>$approval,'delivery_token'=>$token];
    }
    private function authenticate(string $token,?string $orderId=null): array {
        if (!preg_match('/^[0-9a-f]{64}$/D',$token)) { throw new PaymentException('invalid_delivery_credentials'); }
        $row=$this->store->one('SELECT * FROM orders WHERE token_hash=?',[hash('sha256',$token)]);
        if ($row===null||($orderId!==null&&$row['order_id']!==$orderId)) { throw new PaymentException('invalid_delivery_credentials'); }
        return $row;
    }
    public function status(string $token): array {
        $this->ready(); $r=$this->authenticate($token); $status=$r['status'];
        if (($status==='paid' && (int)$r['expires_at']<=$this->now()) || ($status==='pending' && (int)$r['created_at']+10800<$this->now())) { $status='expired'; }
        return ['status'=>$status,'term'=>$r['term'],'installation_id'=>$r['installation_id'],'order_id'=>$r['order_id'],
            'expires_at'=>$r['expires_at']===null ? null : (int)$r['expires_at']];
    }
    /** Browser return alone never grants entitlement. Capture retries reuse the same provider key. */
    public function captureOrder(string $orderId,string $token): array {
        $this->ready(); self::id($orderId); $row=$this->authenticate($token,$orderId);
        if ((int)$row['denied']===1) { throw new PaymentException('order_blocked'); }
        if ($row['status']==='paid') { return ['status'=>'awaiting_verified_license_delivery']; }
        if ($this->now()-(int)$row['created_at']>10800) { throw new PaymentException('checkout_expired'); }
        $order=$this->paypal->request('GET','/v2/checkout/orders/'.$orderId); $this->validateOrder($row,$order);
        // An ambiguous previous capture can be COMPLETED. Still wait for verified webhook settlement.
        if (($order['status']??'')==='COMPLETED') { return ['status'=>'awaiting_verified_payment']; }
        if (($order['status']??'')!=='APPROVED') { throw new PaymentException('order_not_approved'); }
        $this->paypal->request('POST','/v2/checkout/orders/'.$orderId.'/capture',[], 'ca-'.$row['local_id']);
        return ['status'=>'awaiting_verified_payment'];
    }
    public function cancelOrder(string $orderId,string $token): array {
        $this->ready(); $row=$this->authenticate($token,self::id($orderId));
        $order=$this->paypal->request('GET','/v2/checkout/orders/'.$orderId);
        $this->validateOrder($row,$order);
        if (!in_array($order['status']??'', ['CREATED','SAVED'], true)) { throw new PaymentException('approved_or_paid_order_requires_support'); }
        return $this->store->transaction(function() use($row): array {
            $current=$this->store->one('SELECT * FROM orders WHERE local_id=?',[$row['local_id']]);
            if ($current['status']!=='pending' || (int)$current['denied']!==0) { throw new PaymentException('order_blocked'); }
            $this->store->run('UPDATE orders SET status=?,denied=1 WHERE local_id=?',['cancelled',$row['local_id']]);
            return ['status'=>'cancelled'];
        });
    }
    private function amount(array $amount,array $term): void {
        if (($amount['currency_code']??'')!==$term['currency_code']||($amount['value']??'')!==$term['value']) {
            throw new PaymentException('amount_or_currency_mismatch');
        }
    }
    private function validateOrder(array $row,array $order): void {
        $term=Config::term($row['term']); $units=$order['purchase_units']??[];
        if (($order['id']??'')!==$row['order_id']||($order['intent']??'')!=='CAPTURE'||count($units)!==1) { throw new PaymentException('order_mismatch'); }
        $u=$units[0]; $items=$u['items']??[];
        if (($u['custom_id']??'')!==$row['local_id']||($u['invoice_id']??'')!==$row['local_id']||($u['reference_id']??'')!==$row['local_id']
            ||($u['payee']['merchant_id']??'')!==$this->config->get('merchant_id')||count($items)!==1
            ||($items[0]['sku']??'')!==$term['sku']||($items[0]['quantity']??'')!=='1'||($items[0]['category']??'')!=='DIGITAL_GOODS') {
            throw new PaymentException('merchant_or_product_mismatch');
        }
        $this->amount($u['amount']??[],$term); $this->amount($items[0]['unit_amount']??[],$term);
    }
    private function verifiedCapture(array $row,string $captureId): array {
        $capture=$this->paypal->request('GET','/v2/payments/captures/'.self::id($captureId));
        $order=$this->paypal->request('GET','/v2/checkout/orders/'.self::id($row['order_id']));
        $this->validateOrder($row,$order); $this->amount($capture['amount']??[],Config::term($row['term']));
        $captures=$order['purchase_units'][0]['payments']['captures']??[];
        if (($capture['id']??'')!==$captureId||($capture['supplementary_data']['related_ids']['order_id']??'')!==$row['order_id']
            ||count($captures)!==1||($captures[0]['id']??'')!==$captureId||($capture['final_capture']??false)!==true) { throw new PaymentException('capture_binding_mismatch'); }
        if (($capture['status']??'')!=='COMPLETED'||($captures[0]['status']??'')!=='COMPLETED'||($order['status']??'')!=='COMPLETED') {
            throw new PaymentException('payment_not_settled');
        }
        if (($order['purchase_units'][0]['payments']['refunds']??[])!==[]) { throw new PaymentException('payment_refunded'); }
        $paid=self::timestamp($capture['create_time']??null);
        if ($paid>$this->now()+300||$paid<(int)$row['created_at']-300) { throw new PaymentException('payment_timestamp_mismatch'); }
        return ['paid_at'=>$paid,'expires_at'=>self::termEnd($paid,Config::term($row['term'])['months'])];
    }
    /** Calendar months UTC; clamp month end (Jan 31 +1 month = Feb 28/29). */
    public static function termEnd(int $start,int $months): int {
        $date=(new DateTimeImmutable('@'.$start))->setTimezone(new DateTimeZone('UTC'));
        $target=$date->modify('first day of this month')->modify('+'.$months.' months');
        return $target->setDate((int)$target->format('Y'),(int)$target->format('m'),min((int)$date->format('d'),(int)$target->format('t')))->getTimestamp();
    }
    /** Bounded decoded JSON and lowercase actual HTTP headers, never client-supplied header metadata. */
    public function webhook(array $headers,array $event): array {
        $this->ready();
        $verify=['webhook_id'=>$this->config->get('webhook_id'),'webhook_event'=>$event];
        foreach (['auth_algo'=>'paypal-auth-algo','cert_url'=>'paypal-cert-url','transmission_id'=>'paypal-transmission-id',
            'transmission_sig'=>'paypal-transmission-sig','transmission_time'=>'paypal-transmission-time'] as $key=>$header) {
            if (!is_string($headers[$header]??null)||$headers[$header]===''||strlen($headers[$header])>4096) { throw new PaymentException('missing_webhook_signature'); }
            $verify[$key]=$headers[$header];
        }
        // Never download cert_url. Signature verification is delegated to the authenticated PayPal endpoint.
        $result=$this->paypal->request('POST','/v1/notifications/verify-webhook-signature',$verify);
        if (($result['verification_status']??'')!=='SUCCESS') { throw new PaymentException('unverified_webhook'); }
        $eventId=self::id($event['id']??null); $type=$event['event_type']??'';
        foreach ([$event['create_time']??null,$headers['paypal-transmission-time']] as $time) {
            $stamp=self::timestamp($time);
            if ($stamp>$this->now()+300||$stamp<$this->now()-2592000) { throw new PaymentException('stale_or_future_webhook'); }
        }
        $supported=['PAYMENT.CAPTURE.COMPLETED','PAYMENT.CAPTURE.DENIED','PAYMENT.CAPTURE.PENDING','PAYMENT.CAPTURE.REFUNDED',
            'PAYMENT.CAPTURE.REVERSED','CUSTOMER.DISPUTE.CREATED','CUSTOMER.DISPUTE.UPDATED','CUSTOMER.DISPUTE.RESOLVED'];
        if (!in_array($type,$supported,true)) { return ['status'=>'ignored']; }
        if ($this->store->one('SELECT event_id FROM events WHERE event_id=?',[$eventId])!==null) { return ['status'=>'duplicate']; }
        $resource=$event['resource']??[];
        if (str_starts_with($type,'CUSTOMER.DISPUTE.')) {
            $dispute=$this->paypal->request('GET','/v1/customer/disputes/'.self::id($resource['dispute_id']??null));
            if (($dispute['dispute_id']??'')!==$resource['dispute_id']) { throw new PaymentException('dispute_mismatch'); }
            $ids=[];
            foreach ($dispute['disputed_transactions']??[] as $t) { $ids[]=self::id($t['seller_transaction_id']??null); }
            if ($ids===[]) { throw new PaymentException('dispute_transaction_missing'); }
        } elseif ($type==='PAYMENT.CAPTURE.REFUNDED') {
            $refund=$this->paypal->request('GET','/v2/payments/refunds/'.self::id($resource['id']??null));
            if (($refund['id']??'')!==$resource['id']) { throw new PaymentException('refund_mismatch'); }
            $captureId=$refund['supplementary_data']['related_ids']['capture_id']??null;
            foreach ($refund['links']??[] as $link) {
                if (($link['rel']??'')==='up'&&is_string($link['href']??null)
                    &&preg_match('~^https://api(?:-m)?\.(?:sandbox\.)?paypal\.com/v2/payments/captures/([A-Za-z0-9_-]{1,128})$~D',$link['href'],$match)) { $captureId=$match[1]; }
            }
            $ids=[self::id($captureId)];
        } else { $ids=[self::id($resource['id']??null)]; }
        $changes=[];
        foreach ($ids as $captureId) {
            $capture=$this->paypal->request('GET','/v2/payments/captures/'.$captureId);
            if (($capture['id']??'')!==$captureId) { throw new PaymentException('capture_binding_mismatch'); }
            $orderId=self::id($capture['supplementary_data']['related_ids']['order_id']??null);
            $row=$this->store->one('SELECT * FROM orders WHERE order_id=?',[$orderId]);
            if ($row===null) { continue; }
            $order=$this->paypal->request('GET','/v2/checkout/orders/'.$orderId); $this->validateOrder($row,$order);
            $this->amount($capture['amount']??[],Config::term($row['term']));
            $settlement=$type==='PAYMENT.CAPTURE.COMPLETED' ? $this->verifiedCapture($row,$captureId) : null;
            $changes[]=[$row,$captureId,$settlement];
        }
        return $this->store->transaction(function() use($eventId,$type,$changes): array {
            if ($this->store->one('SELECT event_id FROM events WHERE event_id=?',[$eventId])!==null) { return ['status'=>'duplicate']; }
            foreach ($changes as [$row,$captureId,$settlement]) {
                if ($settlement!==null) {
                    // Sticky denial prevents old/concurrent completed events from resurrecting access.
                    $this->store->run('UPDATE orders SET status=?,capture_id=?,paid_at=?,expires_at=? WHERE local_id=? AND denied=0 AND (capture_id IS NULL OR capture_id=?)',
                        ['paid',$captureId,$settlement['paid_at'],$settlement['expires_at'],$row['local_id'],$captureId]);
                } elseif ($type!=='PAYMENT.CAPTURE.PENDING') {
                    $this->store->run('UPDATE orders SET denied=1,status=?,capture_id=COALESCE(capture_id,?) WHERE local_id=?',['blocked',$captureId,$row['local_id']]);
                }
            }
            $this->store->run('INSERT INTO events(event_id,event_type,processed_at) VALUES(?,?,?)',[$eventId,$type,$this->now()]);
            return ['status'=>'processed'];
        });
    }
    private function activeRow(string $token,string $installationId): array {
        $row=$this->authenticate($token);
        if (!hash_equals($row['installation_id'],$installationId)) { throw new PaymentException('installation_mismatch'); }
        if ($row['status']!=='paid'||(int)$row['denied']===1||(int)$row['expires_at']<=$this->now()) { throw new PaymentException('entitlement_not_active'); }
        return $row;
    }
    /** Issued offline leases remain usable <=1 hour; no network calls hold the SQLite writer lock. */
    public function issueLicense(string $token,string $installationId): array {
        $this->ready(); self::installation($installationId);
        $observed=$this->activeRow($token,$installationId);
        $verified=$this->verifiedCapture($observed,$observed['capture_id']);
        return $this->store->transaction(function() use($token,$installationId,$observed,$verified): array {
            // A refund/dispute can commit during the provider fetch. Re-read under the writer lock.
            $row=$this->activeRow($token,$installationId);
            foreach (['local_id','order_id','capture_id','term','paid_at','expires_at','license_id','installation_id','token_hash'] as $key) {
                if ($row[$key]!==$observed[$key]) { throw new PaymentException('entitlement_changed'); }
            }
            if ($verified['paid_at']!==(int)$row['paid_at']||$verified['expires_at']!==(int)$row['expires_at']) { throw new PaymentException('entitlement_mismatch'); }
            $now=$this->now();
            $payload=json_encode(['version'=>1,'product'=>'aiwork-browser','plan'=>'pro','license_id'=>$row['license_id'],
                'installation_id'=>$installationId,'issued_at'=>$now,'expires_at'=>min((int)$row['expires_at'],$now+$this->config->get('lease_seconds')),
                'max_projects'=>$this->config->get('max_projects'),'kind'=>'paid'],JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES);
            return ['payload'=>$payload,'signature_hex'=>bin2hex(sodium_crypto_sign_detached($payload,hex2bin($this->config->get('signing_secret_key_hex'))))];
        });
    }
}
