<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_returns_dashboard_payload(): void
    {
        $this->actingAsApiUser();

        // Some data so aggregates aren't all zero.
        Store::factory()->create();
        Product::factory()->count(3)->create();
        User::factory()->count(2)->create();
        Order::factory()->count(2)->create();

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'stats' => ['totalProducts', 'totalOrders', 'totalUsers', 'totalRevenue'],
                'lowStockProducts',
                'recentOrders',
                'ordersByStatus',
                'topProducts',
            ]);
    }

    #[Test]
    public function guest_cannot_access_dashboard(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();
    }
}
