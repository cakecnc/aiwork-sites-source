<?php
declare(strict_types=1);
// This file contains NO credentials. Copy privately outside every document root.
return [
    'enabled' => false,
    'mode' => null, // Owner must choose. Only explicitly selected one_time is implemented.
    'environment' => 'sandbox',
    'customer_delivery_ready' => false, // Keep false until installer, refresh/recovery and support are validated.
    'origin' => '',
    'return_url' => '', // Exact HTTPS origin + /activate/; never accept a client redirect.
    'cancel_url' => '',
    'merchant_id' => '', 'client_id' => '', 'client_secret' => '', 'webhook_id' => '',
    'signing_secret_key_hex' => '', 'app_public_key_hex' => '',
    'lease_seconds' => 3600, 'max_projects' => 2,
    'database_path' => '', 'session_path' => '',
    'rate_limit_key' => '', // Independent random secret. Never use a PayPal credential here.
];
