<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class CategoriesCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_and_lists_categories_with_auto_category_id(): void
    {
        $this->actingAsApiUser();

        $create = $this->postJson('/api/categories', [
            'name' => 'Electronics',
            'description' => 'All electronics',
            'status' => true,
        ])->assertCreated();

        $this->assertDatabaseHas('categories', ['id' => $create->json('id'), 'name' => 'Electronics']);

        $this->assertNotEmpty($create->json('category_id'));
        $this->assertStringStartsWith('CAT-', $create->json('category_id'));

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonIsArray();
    }

    #[Test]
    public function it_updates_and_deletes_a_category(): void
    {
        $this->actingAsApiUser();

        $category = Category::factory()->create();

        $this->putJson("/api/categories/{$category->id}", ['name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('name', 'New Name');

        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'New Name']);

        $this->deleteJson("/api/categories/{$category->id}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    #[Test]
    public function it_validates_category_create_requires_name(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/categories', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function it_returns_404_for_missing_category(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/categories/999999')->assertNotFound();
    }
}
