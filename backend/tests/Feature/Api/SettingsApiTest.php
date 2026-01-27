<?php

namespace Tests\Feature\Api;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class SettingsApiTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_bulk_updates_and_reads_settings(): void
    {
        $this->actingAsApiUser();

        $this->putJson('/api/settings', [
            'currency' => 'USD',
            'lowStockAlerts' => true,
        ])
            ->assertOk()
            ->assertJsonPath('currency', 'USD')
            ->assertJsonPath('lowStockAlerts', true);

        $this->assertDatabaseHas('settings', ['key' => 'currency']);
        $this->assertDatabaseHas('settings', ['key' => 'lowStockAlerts']);
    }

    #[Test]
    public function it_can_crud_single_setting_by_key(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/settings', [
            'key' => 'timezone',
            'value' => 'UTC',
            'type' => 'string',
            'group' => 'display',
        ])->assertCreated();

        $this->getJson('/api/settings/timezone')
            ->assertOk()
            ->assertJsonPath('key', 'timezone');

        $this->putJson('/api/settings/timezone', ['value' => 'Africa/Lagos'])
            ->assertOk()
            ->assertJsonPath('value', 'Africa/Lagos');

        $this->deleteJson('/api/settings/timezone')
            ->assertOk()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseMissing('settings', ['key' => 'timezone']);
    }

    #[Test]
    public function it_lists_settings_as_key_value_map(): void
    {
        $this->actingAsApiUser();

        Setting::create(['key' => 'currency', 'value' => 'USD', 'type' => 'string', 'group' => 'display']);

        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('currency', 'USD');
    }

    #[Test]
    public function guest_cannot_access_settings(): void
    {
        $this->getJson('/api/settings')->assertUnauthorized();
    }

    #[Test]
    public function it_validates_setting_store_required_fields(): void
    {
        $this->actingAsApiUser();

        $this->postJson('/api/settings', ['key' => 'x'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type', 'group']);
    }

    #[Test]
    public function it_enforces_unique_setting_key(): void
    {
        $this->actingAsApiUser();

        Setting::create(['key' => 'currency', 'value' => 'USD', 'type' => 'string', 'group' => 'display']);

        $this->postJson('/api/settings', [
            'key' => 'currency',
            'value' => 'EUR',
            'type' => 'string',
            'group' => 'display',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['key']);
    }
}
