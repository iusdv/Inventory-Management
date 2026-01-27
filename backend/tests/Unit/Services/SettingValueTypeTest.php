<?php

namespace Tests\Unit\Services;

use App\Services\Settings\SettingValueType;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class SettingValueTypeTest extends TestCase
{
    #[Test]
    public function it_detects_boolean(): void
    {
        $this->assertSame('boolean', SettingValueType::detect(true));
        $this->assertSame('boolean', SettingValueType::detect(false));
    }

    #[Test]
    public function it_detects_number(): void
    {
        $this->assertSame('number', SettingValueType::detect(1));
        $this->assertSame('number', SettingValueType::detect(1.5));
    }

    #[Test]
    public function it_detects_json_for_arrays(): void
    {
        $this->assertSame('json', SettingValueType::detect(['a' => 1]));
    }

    #[Test]
    public function it_defaults_to_string(): void
    {
        $this->assertSame('string', SettingValueType::detect('abc'));
        $this->assertSame('string', SettingValueType::detect(null));
        $this->assertSame('string', SettingValueType::detect((object) ['x' => 1]));
    }
}
