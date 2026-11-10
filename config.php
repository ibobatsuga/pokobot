<?php

/**
 * Helper loader konfigurasi environment sederhana
 */
function env($key, $default = null)
{
    static $envData = null;

    if ($envData === null) {
        $envData = [];
        $envPath = __DIR__ . '/.env';
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, '#')) {
                    continue;
                }
                if (str_contains($line, '=')) {
                    [$name, $value] = explode('=', $line, 2);
                    $name = trim($name);
                    $value = trim($value);
                    // Hapus tanda petik jika ada
                    $value = trim($value, '"\'');
                    $envData[$name] = $value;
                }
            }
        }
    }

    return $envData[$key] ?? getenv($key) ?: $default;
}
