<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            BrandsSeeder::class,
            CategoriesSeeder::class,
            ProductsSeeder::class,
            OrdersSeeder::class,
        ]);
    }
}
