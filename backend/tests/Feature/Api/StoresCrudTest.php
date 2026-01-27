<?php

namespace Tests\Feature\Api;

use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class StoresCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_updates_and_deletes_a_store(): void
    {
        $this->actingAsApiUser();

        $create = $this->postJson('/api/stores', [
            'name' => 'Main Store',
        ])->assertCreated();

        $storeId = $create->json('id');
        $createdCode = $create->json('code');
        $this->assertNotEmpty($createdCode);
        $this->assertDatabaseHas('stores', ['id' => $storeId, 'name' => 'Main Store']);

        $this->getJson("/api/stores/{$storeId}")
            ->assertOk()
            ->assertJsonPath('id', $storeId);

        $this->putJson("/api/stores/{$storeId}", ['name' => 'Main Store 2', 'code' => null])
            ->assertOk()
            ->assertJsonPath('name', 'Main Store 2');

        $this->assertDatabaseHas('stores', ['id' => $storeId, 'name' => 'Main Store 2']);

        $this->deleteJson("/api/stores/{$storeId}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('stores', ['id' => $storeId]);
    }

    #[Test]
    public function it_lists_stores(): void
    {
        $this->actingAsApiUser();
        Store::factory()->count(2)->create();

        $this->getJson('/api/stores')->assertOk()->assertJsonIsArray();
    }

    #[Test]
    public function it_validates_store_code_uniqueness(): void
    {
        $this->actingAsApiUser();

        $existing = Store::factory()->create(['code' => 'ST-UNIQUE']);

        $this->postJson('/api/stores', ['name' => 'Another', 'code' => $existing->code])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['code']);
    }

    #[Test]
    public function it_returns_404_for_missing_store(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/stores/999999')->assertNotFound();
    }
}
