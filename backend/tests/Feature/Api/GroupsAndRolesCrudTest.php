<?php

namespace Tests\Feature\Api;

use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class GroupsAndRolesCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_updates_and_deletes_a_group(): void
    {
        $this->actingAsApiUser();

        $create = $this->postJson('/api/groups', [
            'name' => 'admin',
            'description' => 'Admin group',
            'permissions' => ['users.read' => true],
        ])->assertCreated();

        $id = $create->json('id');
        $this->assertDatabaseHas('groups', ['id' => $id, 'name' => 'admin']);

        $this->putJson("/api/groups/{$id}", ['description' => 'Updated'])
            ->assertOk()
            ->assertJsonPath('description', 'Updated');

        $this->assertDatabaseHas('groups', ['id' => $id, 'description' => 'Updated']);

        $this->deleteJson("/api/groups/{$id}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('groups', ['id' => $id]);
    }

    #[Test]
    public function roles_alias_route_works(): void
    {
        $this->actingAsApiUser();
        Group::factory()->count(2)->create();

        $this->getJson('/api/roles')->assertOk()->assertJsonIsArray();
    }

    #[Test]
    public function it_validates_group_create_name(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/groups', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function it_returns_404_for_missing_group(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/groups/999999')->assertNotFound();
    }
}
