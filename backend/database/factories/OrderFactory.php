<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $createdAt = $this->faker->dateTimeBetween('-12 months', 'now');

        $paymentMethod = $this->faker->randomElement(['cash', 'card', 'transfer', 'paypal']);
        $paymentStatus = $this->faker->randomElement(['paid', 'paid', 'paid', 'pending', 'failed']);
        $orderStatus = $paymentStatus === 'paid'
            ? $this->faker->randomElement(['completed', 'completed', 'shipped', 'processing'])
            : $this->faker->randomElement(['pending', 'processing', 'cancelled']);

        return [
            'order_number' => 'ORD-' . $createdAt->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'user_id' => User::query()->inRandomOrder()->value('id'),
            'store_id' => Store::query()->inRandomOrder()->value('id'),
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->optional()->safeEmail(),
            'customer_phone' => $this->faker->optional()->phoneNumber(),
            'customer_address' => $this->faker->optional()->address(),
            'subtotal' => 0,
            'tax' => 0,
            'discount' => 0,
            'total' => 0,
            'payment_method' => $paymentMethod,
            'payment_status' => $paymentStatus,
            'order_status' => $orderStatus,
            'notes' => $this->faker->optional()->sentence(10),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            if (Product::count() === 0) {
                Product::factory()->count(25)->create();
            }

            $products = Product::query()->inRandomOrder()->limit($this->faker->numberBetween(1, 5))->get();
            $subtotal = 0;

            foreach ($products as $product) {
                $quantity = $this->faker->numberBetween(1, 5);
                $price = (float) $product->price;
                $lineTotal = $quantity * $price;

                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $lineTotal,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->created_at,
                ]);

                $subtotal += $lineTotal;
            }

            $discount = $this->faker->boolean(35) ? $this->faker->randomFloat(2, 0, min(25, $subtotal * 0.2)) : 0;
            $tax = $subtotal * 0.1;
            $total = max(0, $subtotal + $tax - $discount);

            $order->update([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
            ]);
        });
    }
}
