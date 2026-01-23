<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        $price = $this->faker->randomFloat(2, 5, 500);
        $cost = max(0.5, $price * $this->faker->randomFloat(2, 0.4, 0.85));

        $brandId = Brand::query()->inRandomOrder()->value('id');
        $categoryId = Category::query()->inRandomOrder()->value('id');

        return [
            'name' => ucwords($name),
            'sku' => 'SKU-' . strtoupper(Str::random(12)),
            'description' => $this->faker->optional()->sentence(12),
            'category_id' => $categoryId,
            'brand_id' => $brandId,
            'price' => $price,
            'cost' => $cost,
            'quantity' => $this->faker->numberBetween(0, 200),
            'min_quantity' => $this->faker->numberBetween(0, 20),
            'max_quantity' => $this->faker->numberBetween(50, 400),
            'image' => null,
            'status' => true,
        ];
    }
}
