<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            // string identifier separate from primary key
            'category_id' => 'CAT-' . strtoupper(Str::random(12)),
            'name' => ucwords($this->faker->unique()->words(2, true)),
            'description' => $this->faker->optional()->sentence(14),
            'status' => true,
        ];
    }
}
