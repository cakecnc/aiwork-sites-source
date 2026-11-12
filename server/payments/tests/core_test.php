<?php
declare(strict_types=1);
require_once __DIR__.'/../src/Core.php';
use Aiwork\Payments\{Config,Store,PayPal,PaymentService,PaymentException};

function check(bool $ok,string $message): void { if (!$ok) { throw new RuntimeException($message); } }
function rejects(callable $fn,string $code): void {
    try { $fn(); } catch(PaymentException $e) { check($e->getMessage()===$code,'Expected '.$code.', got '.$e->getMessage()); return; }
    throw new RuntimeException('Expected rejection: '.$code);
}
final class FakePayPal implements PayPal {
    public array $orders=[],$captures=[],$refunds=[],$disputes=[],$requests=[];
    public bool $verified=true;
    public ?\Closure $onRead=null;
    public ?string $approvalOverride=null;
    public int $now;
    public function __construct(int $now) { $this->now=$now; }
    public function request(string $method,string $path,?array $body=null,?string $requestId=null): array {
        $this->requests[]=[$method,$path,$body,$requestId];
        if ($requestId!==null) { check(strlen($requestId)<=38,'PayPal request ID length'); }
        if ($path==='/v1/notifications/verify-webhook-signature') { return ['verification_status'=>$this->verified?'SUCCESS':'FAILURE']; }
        if ($method==='POST' && $path==='/v2/checkout/orders') {
            $id='ORDER'.(count($this->orders)+1);
            $this->orders[$id]=$body+['id'=>$id,'status'=>'APPROVED'];
            return ['id'=>$id,'links'=>[['rel'=>'payer-action','href'=>$this->approvalOverride??'https://www.sandbox.paypal.com/checkoutnow?token='.$id]]];
        }
        if (preg_match('~^/v2/checkout/orders/(ORDER\d+)/capture$~',$path,$m) && $method==='POST') {
            $this->settle($m[1]); return $this->orders[$m[1]];
        }
        foreach (['/v2/checkout/orders/'=>'orders','/v2/payments/captures/'=>'captures','/v2/payments/refunds/'=>'refunds','/v1/customer/disputes/'=>'disputes'] as $prefix=>$prop) {
            if ($method==='GET' && str_starts_with($path,$prefix)) {
                $id=substr($path,strlen($prefix));
                if (!isset($this->{$prop}[$id])) { throw new RuntimeException('Missing fixture '.$path); }
                $result=$this->{$prop}[$id];
                if ($this->onRead!==null) { $hook=$this->onRead; $this->onRead=null; $hook(); }
                return $result;
            }
        }
        throw new RuntimeException('Unexpected request '.$method.' '.$path);
    }
    public function settle(string $id): string {
        $captureId='CAPTURE'.$id;
        $this->captures[$captureId]=['id'=>$captureId,'status'=>'COMPLETED','final_capture'=>true,
            'create_time'=>gmdate('Y-m-d\TH:i:s\Z',$this->now),'amount'=>$this->orders[$id]['purchase_units'][0]['amount'],
            'supplementary_data'=>['related_ids'=>['order_id'=>$id]]];
        $this->orders[$id]['status']='COMPLETED';
        $this->orders[$id]['purchase_units'][0]['payments']=['captures'=>[['id'=>$captureId,'status'=>'COMPLETED']]];
        return $captureId;
    }
}
function fixture(): array {
    $now=1794477600;
    $key=sodium_crypto_sign_keypair(); // Ephemeral fixture keys only, never deployment material.
    $values=['enabled'=>true,'environment'=>'sandbox','mode'=>'one_time','merchant_id'=>'MERCHANT123','webhook_id'=>'TEST-WEBHOOK',
        'signing_secret_key_hex'=>bin2hex(sodium_crypto_sign_secretkey($key)),
        'app_public_key_hex'=>bin2hex(sodium_crypto_sign_publickey($key)),
        'return_url'=>'https://example.test/payment/return','cancel_url'=>'https://example.test/payment/cancel'];
    $store=new Store(new PDO('sqlite::memory:')); $store->migrate();
    $paypal=new FakePayPal($now); $clock=(object)['now'=>$now];
    $service=new PaymentService(Config::fromArray($values),$store,$paypal,static fn(): int=>$clock->now);
    return [$service,$store,$paypal,$clock,$values];
}
function headers(int $now): array { return ['paypal-auth-algo'=>'SHA256withRSA','paypal-cert-url'=>'https://api.paypal.com/test-cert',
    'paypal-transmission-id'=>'TEST-TRANSMISSION','paypal-transmission-sig'=>'fixture-signature','paypal-transmission-time'=>gmdate('Y-m-d\TH:i:s\Z',$now)]; }
function event(int $now,string $type,string $resourceId,string $eventId='EVENT1'): array {
    return ['id'=>$eventId,'create_time'=>gmdate('Y-m-d\TH:i:s\Z',$now),'event_type'=>$type,'resource'=>['id'=>$resourceId]];
}
function paid(): array {
    [$service,$store,$paypal,$clock,$values]=fixture();
    $checkout=$service->createOrder('half_year',str_repeat('a',32));
    $service->captureOrder($checkout['order_id'],$checkout['delivery_token']);
    $capture='CAPTURE'.$checkout['order_id'];
    $service->webhook(headers($clock->now),event($clock->now,'PAYMENT.CAPTURE.COMPLETED',$capture));
    return [$service,$store,$paypal,$clock,$values,$checkout,$capture];
}

$tests=[];
$tests['disabled and undecided fail closed']=function(): void {
    rejects(fn()=>Config::fromArray([])->assertReady(),'payments_disabled');
    rejects(fn()=>Config::fromArray(['enabled'=>true,'environment'=>'sandbox'])->assertReady(),'billing_mode_not_supported_or_undecided');
    rejects(fn()=>Config::fromArray(['enabled'=>true,'environment'=>'sandbox','mode'=>'recurring'])->assertReady(),'billing_mode_not_supported_or_undecided');
};
$tests['missing or mismatched signing configuration']=function(): void {
    [,,,,$v]=fixture();
    rejects(fn()=>Config::fromArray(array_replace($v,['signing_secret_key_hex'=>'']))->assertReady(),'signing_configuration_missing');
    rejects(fn()=>Config::fromArray(array_replace($v,['app_public_key_hex'=>str_repeat('a',64)]))->assertReady(),'app_public_key_mismatch');
};
$tests['fixed prices only and installation format']=function(): void {
    [$s,,$p]=fixture();
    rejects(fn()=>$s->createOrder('custom-0.01',str_repeat('a',32)),'unknown_term');
    rejects(fn()=>$s->createOrder('monthly','arbitrary'),'invalid_installation_id');
    foreach (['monthly'=>'19.00','half_year'=>'114.00','yearly'=>'228.00'] as $term=>$amount) {
        $r=$s->createOrder($term,str_repeat('a',32));
        check($p->orders[$r['order_id']]['purchase_units'][0]['amount']['value']===$amount,'Fixed catalog price');
    }
};
$tests['no return/capture activation and token hashed']=function(): void {
    [$s,$store,$p]=fixture(); $r=$s->createOrder('monthly',str_repeat('a',32));
    $row=$store->one('SELECT * FROM orders WHERE order_id=?',[$r['order_id']]);
    check($row['token_hash']===hash('sha256',$r['delivery_token']),'Token hash persisted');
    check(!str_contains(json_encode($row),$r['delivery_token']),'Raw token not persisted');
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'entitlement_not_active');
    $s->captureOrder($r['order_id'],$r['delivery_token']);
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'entitlement_not_active');
    check($s->captureOrder($r['order_id'],$r['delivery_token'])['status']==='awaiting_verified_payment','Ambiguous capture safe retry');
};
$tests['exact envelope signature claims and short lease']=function(): void {
    [$s,,$p,$clock,$v,$r]=paid();
    $license=$s->issueLicense($r['delivery_token'],str_repeat('a',32));
    check(sodium_crypto_sign_verify_detached(hex2bin($license['signature_hex']),$license['payload'],hex2bin($v['app_public_key_hex'])),'Ed25519 verification');
    $c=json_decode($license['payload'],true,512,JSON_THROW_ON_ERROR);
    check($c['version']===1 && $c['product']==='aiwork-browser' && $c['plan']==='pro' && $c['kind']==='paid','Desktop claims');
    check($c['issued_at']===$clock->now && $c['expires_at']===$clock->now+3600 && $c['max_projects']===2,'Bounded lease');
    check($s->status($r['delivery_token'])['expires_at']>$c['expires_at'],'Paid term distinct from lease');
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('b',32)),'installation_mismatch');
    rejects(fn()=>$s->issueLicense(str_repeat('0',64),str_repeat('a',32)),'invalid_delivery_credentials');
};
$tests['webhook signature and time validation']=function(): void {
    [$s,,$p,$clock]=fixture();
    $p->verified=false;
    rejects(fn()=>$s->webhook(headers($clock->now),event($clock->now,'PAYMENT.CAPTURE.COMPLETED','C')),'unverified_webhook');
    $p->verified=true;
    rejects(fn()=>$s->webhook([],event($clock->now,'PAYMENT.CAPTURE.COMPLETED','C')),'missing_webhook_signature');
    rejects(fn()=>$s->webhook(headers($clock->now),event($clock->now+301,'PAYMENT.CAPTURE.COMPLETED','C')),'stale_or_future_webhook');
    rejects(fn()=>$s->webhook(headers($clock->now),event($clock->now-2592001,'PAYMENT.CAPTURE.COMPLETED','C')),'stale_or_future_webhook');
};
$tests['duplicate event is idempotent and pending cannot extend']=function(): void {
    [$s,$store,$p,$clock,,$r,$capture]=paid(); $before=$s->status($r['delivery_token']);
    check($s->webhook(headers($clock->now),event($clock->now,'PAYMENT.CAPTURE.COMPLETED',$capture))['status']==='duplicate','Dedup');
    $s->webhook(headers($clock->now),event($clock->now,'PAYMENT.CAPTURE.PENDING',$capture,'PENDING'));
    check($s->status($r['delivery_token'])===$before,'Out-of-order pending cannot change term');
    check((int)$store->one('SELECT COUNT(*) n FROM events',[])['n']===2,'Unique event ledger');
};
$tests['wrong merchant product amount currency and capture binding']=function(): void {
    foreach (['merchant','sku','amount','currency','custom','capture_order','final_capture'] as $case) {
        [$s,,$p,$clock,,$r,$capture]=paid(); $id=$r['order_id'];
        switch($case) {
            case 'merchant': $p->orders[$id]['purchase_units'][0]['payee']['merchant_id']='WRONG'; $code='merchant_or_product_mismatch'; break;
            case 'sku': $p->orders[$id]['purchase_units'][0]['items'][0]['sku']='wrong'; $code='merchant_or_product_mismatch'; break;
            case 'custom': $p->orders[$id]['purchase_units'][0]['custom_id']='wrong'; $code='merchant_or_product_mismatch'; break;
            case 'amount': $p->captures[$capture]['amount']['value']='0.01'; $code='amount_or_currency_mismatch'; break;
            case 'currency': $p->captures[$capture]['amount']['currency_code']='EUR'; $code='amount_or_currency_mismatch'; break;
            case 'capture_order': $p->captures[$capture]['supplementary_data']['related_ids']['order_id']='OTHER'; $code='capture_binding_mismatch'; break;
            default: $p->captures[$capture]['final_capture']=false; $code='capture_binding_mismatch';
        }
        rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),$code);
    }
};
$tests['refund stops renewal even without webhook']=function(): void {
    [$s,,$p,,, $r,$capture]=paid(); $p->captures[$capture]['status']='PARTIALLY_REFUNDED';
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'payment_not_settled');
};
$tests['refund event sticky against later completed event']=function(): void {
    [$s,,$p,$clock,,$r,$capture]=paid();
    $p->refunds['REFUND1']=['id'=>'REFUND1','links'=>[['rel'=>'up','href'=>'https://api-m.sandbox.paypal.com/v2/payments/captures/'.$capture]]];
    $s->webhook(headers($clock->now),event($clock->now,'PAYMENT.CAPTURE.REFUNDED','REFUND1','REFUND_EVENT'));
    $s->webhook(headers($clock->now),event($clock->now,'PAYMENT.CAPTURE.COMPLETED',$capture,'LATE_COMPLETED'));
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'entitlement_not_active');
    check($s->status($r['delivery_token'])['status']==='blocked','Sticky refund hold');
};
$tests['dispute deny reverse holds never auto recover']=function(): void {
    foreach (['CUSTOMER.DISPUTE.CREATED','CUSTOMER.DISPUTE.RESOLVED','PAYMENT.CAPTURE.DENIED','PAYMENT.CAPTURE.REVERSED'] as $type) {
        [$s,,$p,$clock,,$r,$capture]=paid(); $e=event($clock->now,$type,$capture,'BLOCK_EVENT');
        if (str_starts_with($type,'CUSTOMER.DISPUTE.')) {
            $e['resource']=['dispute_id'=>'DISPUTE1'];
            $p->disputes['DISPUTE1']=['dispute_id'=>'DISPUTE1','disputed_transactions'=>[['seller_transaction_id'=>$capture]]];
        }
        $s->webhook(headers($clock->now),$e);
        rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'entitlement_not_active');
    }
};
$tests['cancel and expired term']=function(): void {
    [$s,,$p,$clock]=fixture(); $r=$s->createOrder('monthly',str_repeat('a',32));
    $p->orders[$r['order_id']]['status']='CREATED';
    $s->cancelOrder($r['order_id'],$r['delivery_token']);
    rejects(fn()=>$s->captureOrder($r['order_id'],$r['delivery_token']),'order_blocked');
    [$s,,$p,$clock,,$r]=paid(); $clock->now=$s->status($r['delivery_token'])['expires_at'];
    check($s->status($r['delivery_token'])['status']==='expired','Expired status');
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'entitlement_not_active');
};
$tests['month end clamp and leap year']=function(): void {
    check(gmdate('Y-m-d H:i:s',PaymentService::termEnd(strtotime('2027-01-31T12:34:56Z'),1))==='2027-02-28 12:34:56','Month end clamp');
    check(gmdate('Y-m-d',PaymentService::termEnd(strtotime('2028-01-31T00:00:00Z'),1))==='2028-02-29','Leap year');
};
$tests['transaction rollback and unique replay constraints']=function(): void {
    [, $store]=fixture();
    try { $store->transaction(function() use($store): void {
        $store->run('INSERT INTO events VALUES(?,?,?)',['X','test',1]); throw new RuntimeException('test rollback');
    }); } catch(RuntimeException $e) { check($e->getMessage()==='test rollback','Expected rollback'); }
    check($store->one('SELECT * FROM events WHERE event_id=?',['X'])===null,'Atomic rollback');
    $store->run('INSERT INTO events VALUES(?,?,?)',['X','test',1]);
    try { $store->run('INSERT INTO events VALUES(?,?,?)',['X','test',1]); throw new RuntimeException('No uniqueness'); }
    catch(PDOException) { /* unique event key */ }
};


$tests['two connection replay lock serializes entitlement mutations']=function(): void {
    $file=tempnam(sys_get_temp_dir(),'aiwork-core-test-');
    if ($file===false) { throw new RuntimeException('Temporary database unavailable'); }
    try {
        $a=new Store(new PDO('sqlite:'.$file)); $a->migrate();
        $b=new Store(new PDO('sqlite:'.$file)); $b->db->exec('PRAGMA busy_timeout=1');
        $a->db->exec('BEGIN IMMEDIATE');
        try {
            try { $b->transaction(static fn(): bool=>true); throw new RuntimeException('Concurrent writer unexpectedly entered'); }
            catch(PDOException $e) { check(str_contains(strtolower($e->getMessage()),'locked'),'Concurrent writer must be locked'); }
            $a->run('INSERT INTO events VALUES(?,?,?)',['CONCURRENT','test',1]);
            $a->db->exec('COMMIT');
        } catch(Throwable $e) { $a->db->exec('ROLLBACK'); throw $e; }
        check($b->transaction(fn(): bool=>$b->one('SELECT event_id FROM events WHERE event_id=?',['CONCURRENT'])!==null),'Next writer sees committed replay marker');
    } finally { unset($a,$b); unlink($file); }
};


$tests['approved and captured cancellations refused without mutation']=function(): void {
    [$s,,$p]=fixture(); $r=$s->createOrder('monthly',str_repeat('a',32));
    rejects(fn()=>$s->cancelOrder($r['order_id'],$r['delivery_token']),'approved_or_paid_order_requires_support');
    check($s->status($r['delivery_token'])['status']==='pending','Approval refusal preserves session entitlement');
    $s->captureOrder($r['order_id'],$r['delivery_token']);
    rejects(fn()=>$s->cancelOrder($r['order_id'],$r['delivery_token']),'approved_or_paid_order_requires_support');
    check($s->status($r['delivery_token'])['status']==='pending','Captured refusal preserves pending state');
};
$tests['hold during provider fetch blocks locked issuance']=function(): void {
    [$s,$store,$p,,,$r]=paid();
    $p->onRead=function() use($store,$r): void {
        // This transaction succeeds only because license renewal does NOT hold a writer lock.
        $store->transaction(fn()=>$store->run('UPDATE orders SET denied=1,status=? WHERE order_id=?',['blocked',$r['order_id']]));
    };
    rejects(fn()=>$s->issueLicense($r['delivery_token'],str_repeat('a',32)),'entitlement_not_active');
};
$tests['approval URLs pinned to environment path and exact order']=function(): void {
    foreach (['https://www.paypal.com/checkoutnow?token=ORDER1','https://www.sandbox.paypal.com/evil?token=ORDER1',
        'https://www.sandbox.paypal.com/checkoutnow?token=OTHER','https://www.sandbox.paypal.com/checkoutnow?token=ORDER1#fragment',
        'https://www.sandbox.paypal.com/checkoutnow?token=ORDER1&next=evil'] as $url) {
        [$s,,$p]=fixture(); $p->approvalOverride=$url;
        rejects(fn()=>$s->createOrder('monthly',str_repeat('a',32)),'missing_provider_approval_url');
    }
};

$count=0;
foreach ($tests as $name=>$fn) { $fn(); ++$count; fwrite(STDOUT,"ok $count - $name\n"); }
fwrite(STDOUT,"PASS: $count payment core tests\n");
