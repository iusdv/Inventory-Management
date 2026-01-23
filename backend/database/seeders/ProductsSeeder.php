<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        $count = (int) env('SEED_PRODUCT_COUNT', 60);
        if ($count < 1) {
            return;
        }

        $brandTarget = (int) env('SEED_BRAND_COUNT', 12);
        $categoryTarget = (int) env('SEED_CATEGORY_COUNT', 12);

        $brandExisting = Brand::count();
        $brandMissing = $brandTarget > 0 ? max(0, $brandTarget - $brandExisting) : 0;
        if ($brandMissing > 0) {
            Brand::factory()->count($brandMissing)->create();
            $this->command?->info("ProductsSeeder: seeded {$brandMissing} brands (total now " . Brand::count() . ").");
        }

        $categoryExisting = Category::count();
        $categoryMissing = $categoryTarget > 0 ? max(0, $categoryTarget - $categoryExisting) : 0;
        if ($categoryMissing > 0) {
            Category::factory()->count($categoryMissing)->create();
            $this->command?->info("ProductsSeeder: seeded {$categoryMissing} categories (total now " . Category::count() . ").");
        }

        $existing = Product::count();
        $missing = max(0, $count - $existing);
        if ($missing === 0) {
            $this->command?->info("ProductsSeeder: {$existing} products exist; nothing to seed.");
            return;
        }

        $brandIds = Brand::pluck('id')->all();
        $categoryIds = Category::pluck('id')->all();

        Product::factory()
            ->count($missing)
            ->state(function () use ($brandIds, $categoryIds) {
                return [
                    'brand_id' => !empty($brandIds) ? $brandIds[array_rand($brandIds)] : null,
                    'category_id' => !empty($categoryIds) ? $categoryIds[array_rand($categoryIds)] : null,
                ];
            })
            ->create();

        $this->command?->info("ProductsSeeder: seeded {$missing} products (total now " . Product::count() . ").");
    }
}
