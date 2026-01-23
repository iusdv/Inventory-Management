<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandsSeeder extends Seeder
{
    public function run(): void
    {
        $count = (int) env('SEED_BRAND_COUNT', 12);
        if ($count < 1) {
            return;
        }

        $existing = Brand::count();
        $missing = max(0, $count - $existing);
        if ($missing === 0) {
            $this->command?->info("BrandsSeeder: {$existing} brands exist; nothing to seed.");
            return;
        }

        Brand::factory()->count($missing)->create();
        $this->command?->info("BrandsSeeder: seeded {$missing} brands (total now " . Brand::count() . ").");
    }
}
