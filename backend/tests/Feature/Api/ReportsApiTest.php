<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class ReportsApiTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_returns_sales_report_summary(): void
    {
        $this->actingAsApiUser();

        Store::factory()->create();
        Product::factory()->count(3)->create();
        Order::factory()->count(3)->create(['payment_status' => 'paid']);

        $this->getJson('/api/reports/sales')
            ->assertOk()
            ->assertJsonStructure(['orders', 'summary' => ['totalSales', 'totalOrders', 'averageOrderValue']]);
    }

    #[Test]
    public function it_returns_inventory_report_summary(): void
    {
        $this->actingAsApiUser();

        Product::factory()->count(5)->create();

        $this->getJson('/api/reports/inventory')
            ->assertOk()
            ->assertJsonStructure(['products', 'summary' => ['totalProducts', 'totalValue', 'lowStockCount']]);
    }

    #[Test]
    public function it_returns_top_products_report(): void
    {
        $this->actingAsApiUser();

        $store = Store::factory()->create();
        $product = Product::factory()->create(['price' => 10]);

        $order = Order::factory()->create([
            'store_id' => $store->id,
            'payment_status' => 'paid',
            'order_status' => 'completed',
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 3,
            'price' => 10,
            'total' => 30,
        ]);

        $this->getJson('/api/reports/top-products?limit=5&scope=completed')
            ->assertOk()
            ->assertJsonIsArray();
    }

    #[Test]
    public function it_returns_revenue_report(): void
    {
        $this->actingAsApiUser();

        Store::factory()->create();
        Product::factory()->count(3)->create();
        Order::factory()->count(3)->create(['payment_status' => 'paid']);

        $this->getJson('/api/reports/revenue?period=month&limit=12')
            ->assertOk()
            ->assertJsonIsArray();
    }

    #[Test]
    public function guest_cannot_access_reports(): void
    {
        $this->getJson('/api/reports/sales')->assertUnauthorized();
        $this->getJson('/api/reports/inventory')->assertUnauthorized();
        $this->getJson('/api/reports/top-products')->assertUnauthorized();
        $this->getJson('/api/reports/revenue')->assertUnauthorized();
    }
}
