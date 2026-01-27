<?php

namespace Tests\Feature\Api;

use App\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class BrandsCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function guest_cannot_access_brands(): void
    {
        $this->getJson('/api/brands')->assertUnauthorized();
    }

    #[Test]
    public function it_lists_brands(): void
    {
        $this->actingAsApiUser();
        Brand::factory()->count(2)->create();

        $this->getJson('/api/brands')
            ->assertOk()
            ->assertJsonIsArray();
    }

    #[Test]
    public function it_creates_updates_and_deletes_a_brand(): void
    {
        $this->actingAsApiUser();

        $create = $this->postJson('/api/brands', [
            'name' => 'Acme',
            'description' => 'Desc',
            'status' => true,
        ])->assertCreated();

        $brandId = $create->json('id');
        $this->assertDatabaseHas('brands', ['id' => $brandId, 'name' => 'Acme']);

        $this->getJson("/api/brands/{$brandId}")
            ->assertOk()
            ->assertJsonPath('id', $brandId);

        $this->putJson("/api/brands/{$brandId}", ['name' => 'Acme 2'])
            ->assertOk()
            ->assertJsonPath('name', 'Acme 2');

        $this->assertDatabaseHas('brands', ['id' => $brandId, 'name' => 'Acme 2']);

        $this->deleteJson("/api/brands/{$brandId}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('brands', ['id' => $brandId]);
    }

    #[Test]
    public function it_validates_brand_create(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/brands', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function it_returns_404_for_missing_brand(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/brands/999999')->assertNotFound();
    }

    #[Test]
    public function it_validates_brand_update_name_type(): void
    {
        $this->actingAsApiUser();
        $brand = Brand::factory()->create();

        $this->putJson("/api/brands/{$brand->id}", ['name' => ['not-a-string']])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }
}
