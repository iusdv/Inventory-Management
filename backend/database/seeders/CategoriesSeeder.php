<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $count = (int) env('SEED_CATEGORY_COUNT', 12);
        if ($count < 1) {
            return;
        }

        $existing = Category::count();
        $missing = max(0, $count - $existing);
        if ($missing === 0) {
            $this->command?->info("CategoriesSeeder: {$existing} categories exist; nothing to seed.");
            return;
        }

        Category::factory()->count($missing)->create();
        $this->command?->info("CategoriesSeeder: seeded {$missing} categories (total now " . Category::count() . ").");
    }
}
