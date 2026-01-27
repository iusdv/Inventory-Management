<?php

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 5);
        $price = $this->faker->randomFloat(2, 5, 500);

        return [
            'order_id' => null,
            'product_id' => null,
            'quantity' => $quantity,
            'price' => $price,
            'total' => $quantity * $price,
        ];
    }
}
