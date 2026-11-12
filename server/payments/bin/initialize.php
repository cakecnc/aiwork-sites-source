<?php
declare(strict_types=1);
require dirname(__DIR__).'/src/Core.php';
use Aiwork\Payments\Store;
// Offline provisioning only. Never called from a web request. No credentials created.
$root=realpath($argv[1]??'');
if(!$root||!is_dir($root)||is_link($argv[1])||preg_match('~(?:^|/)public_html(?:/|$)~i',$root)||(fileperms($root)&0077)!==0){fwrite(STDERR,"Provide an existing private 0700 root outside document roots.\n");exit(2);}
$database=$root.'/payments.sqlite';$sessions=$root.'/sessions';
if(file_exists($database)||file_exists($sessions)){fwrite(STDERR,"Refusing existing state.\n");exit(2);}
umask(0077);
$handle=fopen($database,'x');if(!$handle)throw new RuntimeException('CREATE_FAILED');fclose($handle);
if(!mkdir($sessions,0700))throw new RuntimeException('CREATE_FAILED');
$pdo=new PDO('sqlite:'.$database,null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
(new Store($pdo))->migrate();
$pdo->exec('CREATE TABLE payment_http_limits(identity TEXT NOT NULL,action TEXT NOT NULL,bucket INTEGER NOT NULL,count INTEGER NOT NULL,PRIMARY KEY(identity,action,bucket))');
echo "Private empty payment state initialized. Checkout remains disabled.\n";
