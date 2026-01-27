<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OrdersSeeder extends Seeder
{
    public function run(): void
    {
        if (User::count() === 0) {
            User::factory()->create([
                'name' => 'Demo Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => true,
            ]);
        }

        if (Store::count() === 0) {
            Store::factory()->count(3)->create();
        }

        // Ensure we have enough products so orders distribute across many items.
        // This prevents reports/top-products from collapsing to 1-2 products.
        $minProducts = (int) env('SEED_MIN_PRODUCTS_FOR_ORDERS', 100);
        $existingProducts = Product::count();
        $missingProducts = $minProducts > 0 ? max(0, $minProducts - $existingProducts) : 0;
        if ($missingProducts > 0) {
            Product::factory()->count($missingProducts)->create();
            $this->command?->info("OrdersSeeder: seeded {$missingProducts} extra products (total now " . Product::count() . ").");
        }

        $count = (int) (env('SEED_ORDER_COUNT', 1000));
        if ($count < 1) {
            return;
        }

        // Generate orders spread across the last 12 months
        Order::factory()->count($count)->create();
    }
}
