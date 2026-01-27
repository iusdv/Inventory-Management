<?php

namespace App\Services\Settings;

class SettingValueType
{
    public static function detect(mixed $value): string
    {
        return match (true) {
            is_bool($value) => 'boolean',
            is_int($value), is_float($value) => 'number',
            is_array($value) => 'json',
            default => 'string',
        };
    }
}
