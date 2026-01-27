<?php

namespace Tests\Feature\Api;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class UsersCrudTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_updates_and_deletes_a_user(): void
    {
        $this->actingAsApiUser();

        $role = Group::factory()->create(['name' => 'manager']);

        $create = $this->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
            'status' => true,
        ])->assertCreated();

        $id = $create->json('id');
        $this->assertDatabaseHas('users', ['id' => $id, 'email' => 'testuser@example.com', 'group_id' => $role->id]);

        $this->getJson("/api/users/{$id}")
            ->assertOk()
            ->assertJsonPath('id', $id);

        $this->putJson("/api/users/{$id}", ['name' => 'Updated Name'])
            ->assertOk()
            ->assertJsonPath('name', 'Updated Name');

        $this->assertDatabaseHas('users', ['id' => $id, 'name' => 'Updated Name']);

        $this->deleteJson("/api/users/{$id}")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('users', ['id' => $id]);
    }

    #[Test]
    public function it_lists_users(): void
    {
        $this->actingAsApiUser();
        User::factory()->count(2)->create();

        $this->getJson('/api/users')->assertOk()->assertJsonIsArray();
    }

    #[Test]
    public function guest_cannot_access_users(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
    }

    #[Test]
    public function it_validates_user_create_payload(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/users', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password', 'role_id']);
    }

    #[Test]
    public function it_enforces_unique_email_on_create(): void
    {
        $this->actingAsApiUser();

        $role = Group::factory()->create(['name' => 'staff']);
        User::factory()->create(['email' => 'dup@example.com']);

        $this->postJson('/api/users', [
            'name' => 'Dup',
            'email' => 'dup@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function it_returns_404_for_missing_user(): void
    {
        $this->actingAsApiUser();
        $this->getJson('/api/users/999999')->assertNotFound();
    }
}
