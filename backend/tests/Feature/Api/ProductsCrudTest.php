<?php

namespace Tests\Feature\Api;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class ProductsCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_updates_and_deletes_a_product(): void
    {
        $this->actingAsApiUser();

        $brand = Brand::factory()->create();
        $category = Category::factory()->create();

        $payload = [
            'name' => 'Test Product',
            'sku' => 'SKU-' . Str::upper(Str::random(10)),
            'description' => 'Desc',
            'brand_id' => $brand->id,
            'category_id' => $category->id,
            'price' => 12.50,
            'cost' => 7.25,
            'quantity' => 10,
            'status' => true,
        ];

        $create = $this->postJson('/api/products', $payload)->assertCreated();
        $id = $create->json('id');

        $this->assertDatabaseHas('products', ['id' => $id, 'sku' => $payload['sku']]);

        $this->getJson("/api/products/{$id}")->assertOk()->assertJsonPath('id', $id);

        $this->putJson("/api/products/{$id}", ['price' => 20.00])
            ->assertOk()
            ->assertJsonPath('price', '20.00');

        $this->assertDatabaseHas('products', ['id' => $id, 'price' => 20.00]);

        $this->deleteJson("/api/products/{$id}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('products', ['id' => $id]);
    }

    #[Test]
    public function it_validates_required_product_fields(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/products', ['name' => 'Only Name'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sku', 'price', 'cost', 'quantity']);
    }

    #[Test]
    public function it_lists_products(): void
    {
        $this->actingAsApiUser();
        Product::factory()->count(2)->create();

        $this->getJson('/api/products')->assertOk()->assertJsonIsArray();
    }

    #[Test]
    public function it_enforces_unique_sku(): void
    {
        $this->actingAsApiUser();

        $existing = Product::factory()->create(['sku' => 'SKU-DUPLICATE']);

        $this->postJson('/api/products', [
            'name' => 'Another',
            'sku' => $existing->sku,
            'price' => 1,
            'cost' => 1,
            'quantity' => 1,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sku']);
    }

    #[Test]
    public function it_returns_404_for_missing_product(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/products/999999')->assertNotFound();
    }
}
