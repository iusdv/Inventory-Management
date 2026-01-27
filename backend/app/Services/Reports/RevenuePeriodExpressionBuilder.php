<?php

namespace App\Services\Reports;

class RevenuePeriodExpressionBuilder
{
    public function build(string $driver, string $period): string
    {
        $period = strtolower(trim($period));

        if ($driver === 'sqlite') {
            $dateFormat = match ($period) {
                'day' => '%Y-%m-%d',
                'week' => '%Y-%W',
                'month' => '%Y-%m',
                'year' => '%Y',
                default => '%Y-%m',
            };

            return "strftime('{$dateFormat}', created_at)";
        }

        $dateFormat = match ($period) {
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            'year' => '%Y',
            default => '%Y-%m',
        };

        return "DATE_FORMAT(created_at, '{$dateFormat}')";
    }
}
