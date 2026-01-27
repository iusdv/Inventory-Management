<?php

namespace Tests\Feature\Api;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_registers_a_user_and_returns_token(): void
    {
        Group::factory()->create(['name' => 'user']);

        $payload = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->postJson('/api/register', $payload)
            ->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'user']);

        $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
    }

    #[Test]
    public function it_logs_in_and_returns_token(): void
    {
        Group::factory()->create(['name' => 'user']);

        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
        ]);

        $this->postJson('/api/login', ['email' => 'john@example.com', 'password' => 'password'])
            ->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }

    #[Test]
    public function it_requires_auth_for_user_endpoint(): void
    {
        $this->getJson('/api/user')->assertUnauthorized();
    }

    #[Test]
    public function it_returns_current_user_when_authenticated(): void
    {
        $group = Group::factory()->create(['name' => 'user']);
        $user = User::factory()->create(['group_id' => $group->id, 'role' => 'user']);
        Sanctum::actingAs($user);

        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $user->id);
    }

    #[Test]
    public function it_requires_auth_for_logout(): void
    {
        $this->postJson('/api/logout')->assertUnauthorized();
    }
}
