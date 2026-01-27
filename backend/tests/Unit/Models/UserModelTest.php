<?php

namespace Tests\Unit\Models;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    #[Test]
    public function it_defines_expected_relationships(): void
    {
        $user = new User();

        $this->assertInstanceOf(BelongsTo::class, $user->group());
        $this->assertInstanceOf(BelongsTo::class, $user->role());
        $this->assertInstanceOf(HasMany::class, $user->orders());

        $this->assertSame((new Group())->getTable(), $user->group()->getRelated()->getTable());
        $this->assertSame('group_id', $user->role()->getForeignKeyName());
    }

    #[Test]
    public function it_hides_sensitive_fields(): void
    {
        $user = new User(['password' => 'secret']);

        $array = $user->toArray();
        $this->assertArrayNotHasKey('password', $array);
    }
}
