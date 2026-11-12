<?php
declare(strict_types=1);
require dirname(__DIR__) . '/src/Core.php';
use Aiwork\Payments\Config;
$example=($argv[1]??'')==='--example';
$path=$example?dirname(__DIR__).'/config.example.php':($argv[2]??'');
if(!$example&&($argv[1]??'')!=='--config'){fwrite(STDERR,"Usage: php preflight.php --example | --config /private/config.php\n");exit(2);}
try{
    if(!is_file($path)||is_link($path))throw new RuntimeException('CONFIG_FILE_REQUIRED');
    $settings=require $path;
    if(!is_array($settings))throw new RuntimeException('CONFIG_FORMAT_INVALID');
    Config::fromArray($settings);
    $checks=['php'=>PHP_VERSION_ID>=80200,'sodium'=>extension_loaded('sodium'),'pdo_sqlite'=>extension_loaded('pdo_sqlite'),'curl'=>extension_loaded('curl')];
    if($example){
        $checks['disabled']=($settings['enabled']??null)===false;
        $checks['mode_undecided']=array_key_exists('mode',$settings)&&$settings['mode']===null;
        $checks['delivery_not_ready']=($settings['customer_delivery_ready']??null)===false;
        foreach(['merchant_id','client_id','client_secret','webhook_id','signing_secret_key_hex','app_public_key_hex','origin','database_path','session_path','rate_limit_key']as$key)$checks['blank_'.$key]=($settings[$key]??null)==='';
    }else{
        $root=realpath(dirname($path));
        $checks['config_private']=(fileperms($path)&0077)===0;
        $checks['root_private']=(fileperms($root)&0077)===0&&!preg_match('~(?:^|/)public_html(?:/|$)~i',$root);
        foreach(['database_path','session_path']as$key){$value=$settings[$key]??'';$resolved=is_string($value)?realpath($value):false;$checks[$key.'_private']=$resolved&&str_starts_with($resolved,$root.'/')&&!is_link($value)&&(fileperms($resolved)&0077)===0;}
        $checks['ready_for_live_sales']=false; // This release does not include automated desktop refresh or account recovery.
    }
    $ok=!in_array(false,$checks,true);
    echo json_encode(['mode'=>$example?'example':'private_readiness','checks'=>$checks,'ready'=>$ok,'network_called'=>false,'credentials_printed'=>false],JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR)."\n";
    exit($ok?0:1);
}catch(Throwable){fwrite(STDERR,"Payment preflight failed; check configuration privately. No values are printed.\n");exit(1);}
