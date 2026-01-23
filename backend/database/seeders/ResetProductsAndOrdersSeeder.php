<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResetProductsAndOrdersSeeder extends Seeder
{
    public function run(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
        }

        // Orders first
        if (DB::getSchemaBuilder()->hasTable('order_items')) {
            DB::table('order_items')->truncate();
        }
        if (DB::getSchemaBuilder()->hasTable('orders')) {
            DB::table('orders')->truncate();
        }

        // Product-related pivots
        if (DB::getSchemaBuilder()->hasTable('product_attribute')) {
            DB::table('product_attribute')->truncate();
        }
        if (DB::getSchemaBuilder()->hasTable('product_store')) {
            DB::table('product_store')->truncate();
        }

        // Products
        if (DB::getSchemaBuilder()->hasTable('products')) {
            DB::table('products')->truncate();
        }

        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON');
        }

        $this->command?->info('ResetProductsAndOrdersSeeder: truncated orders/order_items/products and related pivot tables.');
    }
}
