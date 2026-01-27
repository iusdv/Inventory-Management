<?php

namespace Tests\Feature\Api;

use App\Models\Attribute;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class AttributesCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_updates_and_deletes_an_attribute(): void
    {
        $this->actingAsApiUser();

        $create = $this->postJson('/api/attributes', [
            'name' => 'Color',
            'type' => 'select',
            'values' => ['Red', 'Blue'],
            'status' => true,
        ])->assertCreated();

        $id = $create->json('id');
        $this->assertDatabaseHas('attributes', ['id' => $id, 'name' => 'Color']);

        $this->getJson("/api/attributes/{$id}")
            ->assertOk()
            ->assertJsonPath('id', $id);

        $this->putJson("/api/attributes/{$id}", ['name' => 'Colour'])
            ->assertOk()
            ->assertJsonPath('name', 'Colour');

        $this->assertDatabaseHas('attributes', ['id' => $id, 'name' => 'Colour']);

        $this->deleteJson("/api/attributes/{$id}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('attributes', ['id' => $id]);
    }

    #[Test]
    public function it_lists_attributes(): void
    {
        $this->actingAsApiUser();
        Attribute::factory()->count(2)->create();

        $this->getJson('/api/attributes')->assertOk()->assertJsonIsArray();
    }

    #[Test]
    public function it_validates_attribute_type_enum(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/attributes', [
            'name' => 'Bad Type',
            'type' => 'invalid',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type']);
    }

    #[Test]
    public function it_returns_404_for_missing_attribute(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/attributes/999999')->assertNotFound();
    }
}
