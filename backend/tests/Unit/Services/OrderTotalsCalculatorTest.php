<?php

namespace Tests\Unit\Services;

use App\Services\Orders\OrderTotalsCalculator;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class OrderTotalsCalculatorTest extends TestCase
{
    #[Test]
    public function it_calculates_subtotal_tax_discount_and_total(): void
    {
        $calculator = new OrderTotalsCalculator();

        $items = [
            ['quantity' => 2, 'price' => 10.00],
            ['quantity' => 1, 'price' => 5.50],
        ];

        $totals = $calculator->calculate($items, 0.1, 2.0);

        $this->assertEqualsWithDelta(25.5, $totals['subtotal'], 0.000001);
        $this->assertEqualsWithDelta(2.55, $totals['tax'], 0.000001);
        $this->assertEqualsWithDelta(2.0, $totals['discount'], 0.000001);
        $this->assertEqualsWithDelta(26.05, $totals['total'], 0.000001);
    }

    #[Test]
    public function it_allows_empty_items(): void
    {
        $calculator = new OrderTotalsCalculator();

        $totals = $calculator->calculate([], 0.1, 0.0);

        $this->assertSame(0.0, $totals['subtotal']);
        $this->assertSame(0.0, $totals['tax']);
        $this->assertSame(0.0, $totals['discount']);
        $this->assertSame(0.0, $totals['total']);
    }

    #[Test]
    public function it_rejects_negative_tax_rate(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new OrderTotalsCalculator())->calculate([['quantity' => 1, 'price' => 1]], -0.01, 0.0);
    }

    #[Test]
    public function it_rejects_negative_discount(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new OrderTotalsCalculator())->calculate([['quantity' => 1, 'price' => 1]], 0.1, -1.0);
    }

    #[Test]
    public function it_rejects_missing_keys(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new OrderTotalsCalculator())->calculate([['quantity' => 1]], 0.1, 0.0);
    }

    #[Test]
    public function it_rejects_negative_quantity_or_price(): void
    {
        $calculator = new OrderTotalsCalculator();

        $this->expectException(InvalidArgumentException::class);
        $calculator->calculate([['quantity' => -1, 'price' => 1]], 0.1, 0.0);
    }
}
