<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $resources = [
            'users',
            'roles',
            'brands',
            'categories',
            'stores',
            'attributes',
            'products',
            'orders',
            'reports',
            'company',
            'profile',
            'settings',
        ];

        $actions = ['create', 'update', 'view', 'delete'];

        $allPermissions = [];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $allPermissions[$resource][$action] = true;
            }
        }

        $now = now();

        $defaultRoleNames = ['admin', 'manager', 'user'];

        foreach ($defaultRoleNames as $name) {
            $exists = DB::table('groups')->where('name', $name)->exists();
            if (!$exists) {
                DB::table('groups')->insert([
                    'name' => $name,
                    'description' => ucfirst($name) . ' role',
                    'permissions' => json_encode($allPermissions),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        $roleIds = DB::table('groups')
            ->whereIn('name', $defaultRoleNames)
            ->pluck('id', 'name');

        // Backfill users.group_id to act as role_id.
        $users = DB::table('users')->select(['id', 'role', 'group_id'])->get();
        foreach ($users as $user) {
            if (!empty($user->group_id)) {
                continue;
            }

            $roleName = strtolower((string) ($user->role ?? ''));
            $mappedRoleId = $roleIds[$roleName] ?? $roleIds['user'] ?? null;

            if ($mappedRoleId) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['group_id' => $mappedRoleId]);
            }
        }
    }

    public function down(): void
    {
        // Best-effort: do not delete groups (roles) automatically.
        // Keeping data is safer than dropping roles users might now depend on.
    }
};
