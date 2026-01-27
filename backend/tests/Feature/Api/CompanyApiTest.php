<?php

namespace Tests\Feature\Api;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\ActsAsApiUser;
use Tests\TestCase;

class CompanyApiTest extends TestCase
{
    use RefreshDatabase;
    use ActsAsApiUser;

    #[Test]
    public function it_creates_or_updates_company_via_store_endpoint(): void
    {
        $this->actingAsApiUser();

        $this->getJson('/api/company')->assertOk();

        $this->postJson('/api/company', [
            'name' => 'My Company',
            'email' => 'company@example.com',
        ])->assertOk();

        $this->assertDatabaseHas('companies', ['name' => 'My Company']);

        $company = Company::firstOrFail();

        $this->putJson("/api/company/{$company->id}", ['name' => 'My Company 2'])
            ->assertOk()
            ->assertJsonPath('name', 'My Company 2');
    }
}
