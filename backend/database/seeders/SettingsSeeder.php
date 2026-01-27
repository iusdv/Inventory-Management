<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // General
            ['key' => 'emailNotifications', 'value' => true, 'type' => 'boolean', 'group' => 'general'],
            ['key' => 'lowStockAlerts', 'value' => true, 'type' => 'boolean', 'group' => 'general'],
            ['key' => 'orderNotifications', 'value' => true, 'type' => 'boolean', 'group' => 'general'],

            // Display
            ['key' => 'currency', 'value' => 'USD', 'type' => 'string', 'group' => 'display'],
            ['key' => 'dateFormat', 'value' => 'MM/DD/YYYY', 'type' => 'string', 'group' => 'display'],
            ['key' => 'timezone', 'value' => 'ET', 'type' => 'string', 'group' => 'display'],

            // Inventory
            ['key' => 'autoUpdateStock', 'value' => true, 'type' => 'boolean', 'group' => 'inventory'],
            ['key' => 'showOutOfStockItems', 'value' => false, 'type' => 'boolean', 'group' => 'inventory'],
        ];

        foreach ($defaults as $row) {
            Setting::updateOrCreate(
                ['key' => $row['key']],
                ['value' => $row['value'], 'type' => $row['type'], 'group' => $row['group']]
            );
        }
    }
}
