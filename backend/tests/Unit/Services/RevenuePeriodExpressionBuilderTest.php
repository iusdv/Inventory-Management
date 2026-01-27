<?php

namespace Tests\Unit\Services;

use App\Services\Reports\RevenuePeriodExpressionBuilder;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class RevenuePeriodExpressionBuilderTest extends TestCase
{
    #[Test]
    public function it_builds_sqlite_strftime_expression(): void
    {
        $builder = new RevenuePeriodExpressionBuilder();

        $this->assertSame(
            "strftime('%Y-%m', created_at)",
            $builder->build('sqlite', 'month')
        );

        $this->assertSame(
            "strftime('%Y-%W', created_at)",
            $builder->build('sqlite', 'week')
        );
    }

    #[Test]
    public function it_builds_mysql_date_format_expression_for_non_sqlite_drivers(): void
    {
        $builder = new RevenuePeriodExpressionBuilder();

        $this->assertSame(
            "DATE_FORMAT(created_at, '%Y-%m')",
            $builder->build('mysql', 'month')
        );

        $this->assertSame(
            "DATE_FORMAT(created_at, '%Y-%u')",
            $builder->build('mysql', 'week')
        );
    }

    #[Test]
    public function it_defaults_unknown_period_to_month(): void
    {
        $builder = new RevenuePeriodExpressionBuilder();

        $this->assertSame(
            "strftime('%Y-%m', created_at)",
            $builder->build('sqlite', 'not-a-period')
        );
    }
}
