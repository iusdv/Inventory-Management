<?php

namespace Tests\Concerns;

use App\Models\Group;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

trait ActsAsApiUser
{
    protected function actingAsApiUser(?Group $group = null): User
    {
        $group ??= Group::query()->firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Admin', 'permissions' => []]
        );

        $user = User::factory()->create([
            'group_id' => $group->id,
            'role' => $group->name,
            'status' => true,
        ]);

        Sanctum::actingAs($user);

        return $user;
    }
}
