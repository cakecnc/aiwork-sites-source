<?php
declare(strict_types=1);
require_once dirname(__DIR__).'/src/Core.php';
require_once __DIR__.'/PayPalHttp.php';
use Aiwork\Payments\PayPalHttp;
function expect(bool $condition,string $label):void{if(!$condition)throw new RuntimeException($label);}
foreach(['http','invalid','']as$environment){try{new PayPalHttp('test','test',$environment);throw new RuntimeException('Environment accepted');}catch(InvalidArgumentException){}}
$transport=new PayPalHttp('synthetic-client','synthetic-secret','sandbox');
foreach(['/v2/checkout/orders/../../oauth2/token','https://evil.test','/v2/checkout/orders?redirect=evil','/v2/checkout/orders/ABC/capture?x=1','/v2/payments/captures/ABC#x']as$path){try{$transport->request('GET',$path);throw new RuntimeException('Untrusted path accepted');}catch(InvalidArgumentException){}}
try{$transport->request('GET','/v2/checkout/orders/ABC',null,"invalid\r\nheader");throw new RuntimeException('Header injection accepted');}catch(InvalidArgumentException){}
function runGateway(string $method,string $action,array $settings):array{
 $file=__DIR__.'/Gateway.php';
 $code='require '.var_export($file,true).'; $_GET=["action"=>'.var_export($action,true).']; $_SERVER=["REQUEST_METHOD"=>'.var_export($method,true).']; Aiwork\\Payments\\Gateway::serve('.var_export($settings,true).',"/synthetic-private-root");';
 $pipes=[];$process=proc_open([PHP_BINARY,'-r',$code],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes);
 if(!is_resource($process))throw new RuntimeException('Subprocess unavailable');fclose($pipes[0]);$out=stream_get_contents($pipes[1]);$err=stream_get_contents($pipes[2]);fclose($pipes[1]);fclose($pipes[2]);$exit=proc_close($process);
 expect($exit===0&&$err==='','Gateway subprocess failed');return json_decode($out,true,32,JSON_THROW_ON_ERROR);
}
foreach(['catalog','session','checkout','capture','license','cancel','webhook']as$action){$result=runGateway(in_array($action,['catalog','session'])?'GET':'POST',$action,[]);expect(($result['enabled']??null)===false,'Default disabled');}
expect(runGateway('POST','checkout',['enabled'=>true,'customer_delivery_ready'=>false])['error']==='CHECKOUT_DISABLED','Delivery gate');
expect(runGateway('GET','checkout',[])['error']==='METHOD_NOT_ALLOWED','Method restriction');
expect(runGateway('GET','unknown',[])['error']==='NOT_FOUND','Route restriction');
echo "PASS: transport validation and 10 fail-closed HTTP cases; zero network calls.\n";
