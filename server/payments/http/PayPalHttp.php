<?php
declare(strict_types=1);
namespace Aiwork\Payments;

/** Pinned PayPal REST transport. No credentials are written to disk or logged. */
final class PayPalHttp implements PayPal
{
    private ?string $accessToken = null;
    private int $validUntil = 0;
    private string $base;
    public function __construct(private string $clientId, private string $clientSecret, string $environment)
    {
        $this->base = match ($environment) {
            'sandbox' => 'https://api-m.sandbox.paypal.com',
            'live' => 'https://api-m.paypal.com',
            default => throw new \InvalidArgumentException('PAYPAL_ENVIRONMENT_INVALID'),
        };
        if ($clientId === '' || $clientSecret === '' || !extension_loaded('curl')) {
            throw new \RuntimeException('PAYPAL_TRANSPORT_NOT_CONFIGURED');
        }
    }
    public function request(string $method, string $path, ?array $body = null, ?string $requestId = null): array
    {
        if (!in_array($method, ['GET', 'POST'], true) || !preg_match('~^/(?:v2/checkout/orders(?:/[A-Z0-9]+(?:/capture)?)?|v2/payments/captures/[A-Z0-9]+|v2/payments/refunds/[A-Za-z0-9_-]{1,128}|v1/customer/disputes/[A-Za-z0-9_-]{1,128}|v1/notifications/verify-webhook-signature)$~D', $path)) {
            throw new \InvalidArgumentException('PAYPAL_PATH_NOT_ALLOWED');
        }
        if ($requestId !== null && !preg_match('/^[A-Za-z0-9_-]{1,38}$/D', $requestId)) throw new \InvalidArgumentException('REQUEST_ID_INVALID');
        $headers = ['Content-Type: application/json', 'Accept: application/json', 'Authorization: Bearer ' . $this->token()];
        if ($requestId !== null) {
            $headers[] = 'PayPal-Request-Id: ' . $requestId;
        }
        return $this->send($method, $path, $body === null ? null : json_encode($body === [] ? (object)[] : $body, JSON_THROW_ON_ERROR), $headers);
    }
    private function token(): string
    {
        if ($this->accessToken !== null && time() < $this->validUntil) return $this->accessToken;
        $result = $this->send('POST', '/v1/oauth2/token', 'grant_type=client_credentials', ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'], true);
        if (!is_string($result['access_token'] ?? null) || $result['access_token'] === '' || strlen($result['access_token']) > 8192 || preg_match('/[\r\n]/', $result['access_token'])) throw new \RuntimeException('PAYPAL_AUTH_FAILED');
        $this->accessToken = $result['access_token'];
        $this->validUntil = time() + max(0, min(3600, (int)($result['expires_in'] ?? 0)) - 60);
        return $this->accessToken;
    }
    private function send(string $method, string $path, ?string $body, array $headers, bool $basic = false): array
    {
        $curl = curl_init($this->base . $path);
        if ($curl === false) throw new \RuntimeException('PAYPAL_UNAVAILABLE');
        $response = '';
        curl_setopt_array($curl, [
            CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $headers,
            CURLOPT_FOLLOWLOCATION => false, CURLOPT_MAXREDIRS => 0,
            CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 25,
            CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$response): int {
                if (strlen($response) + strlen($chunk) > 1048576) return 0;
                $response .= $chunk; return strlen($chunk);
            },
        ]);
        if ($body !== null) curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
        if ($basic) curl_setopt($curl, CURLOPT_USERPWD, $this->clientId . ':' . $this->clientSecret);
        $ok = curl_exec($curl); $status = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE); curl_close($curl);
        if ($ok === false || $status < 200 || $status >= 300) throw new \RuntimeException('PAYPAL_UNAVAILABLE');
        try { $data = json_decode($response, true, 32, JSON_THROW_ON_ERROR); } catch (\JsonException) { throw new \RuntimeException('PAYPAL_INVALID_RESPONSE'); }
        if (!is_array($data)) throw new \RuntimeException('PAYPAL_INVALID_RESPONSE');
        return $data;
    }
}
