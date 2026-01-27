<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class OrdersCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_updates_and_deletes_an_order(): void
    {
        $this->actingAsApiUser();

        $store = Store::factory()->create();
        $product = Product::factory()->create();

        $create = $this->postJson('/api/orders', [
            'customer_name' => 'Customer',
            'store_id' => $store->id,
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2, 'price' => 10.00],
            ],
            'payment_status' => 'paid',
        ])->assertCreated();

        $orderId = $create->json('id');

        // subtotal=20, tax=2 (10%), total=22
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'customer_name' => 'Customer']);

        $this->getJson("/api/orders/{$orderId}")
            ->assertOk()
            ->assertJsonPath('id', $orderId);

        $this->putJson("/api/orders/{$orderId}", ['notes' => 'Updated'])
            ->assertOk()
            ->assertJsonPath('notes', 'Updated');

        $this->assertDatabaseHas('orders', ['id' => $orderId, 'notes' => 'Updated']);

        $this->deleteJson("/api/orders/{$orderId}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('orders', ['id' => $orderId]);
    }

    #[Test]
    public function it_lists_orders(): void
    {
        $this->actingAsApiUser();

        Store::factory()->create();
        Product::factory()->count(3)->create();
        Order::factory()->count(2)->create();

        $this->getJson('/api/orders')->assertOk()->assertJsonIsArray();
    }

    #[Test]
    public function guest_cannot_create_orders(): void
    {
        $this->postJson('/api/orders', [])->assertUnauthorized();
    }

    #[Test]
    public function it_validates_order_create_payload(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/orders', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['customer_name', 'items']);
    }

    #[Test]
    public function it_returns_404_for_missing_order(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/orders/999999')->assertNotFound();
    }
}
