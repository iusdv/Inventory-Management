<?php

namespace Tests\Unit\Models;

use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderModelTest extends TestCase
{
    #[Test]
    public function it_defines_expected_relationships(): void
    {
        $order = new Order();

        $this->assertInstanceOf(BelongsTo::class, $order->user());
        $this->assertInstanceOf(BelongsTo::class, $order->store());
        $this->assertInstanceOf(HasMany::class, $order->orderItems());

        $this->assertSame((new User())->getTable(), $order->user()->getRelated()->getTable());
        $this->assertSame((new Store())->getTable(), $order->store()->getRelated()->getTable());
    }

    #[Test]
    public function it_casts_money_fields_as_decimal_strings(): void
    {
        $order = new Order([
            'subtotal' => 10,
            'tax' => 1.5,
            'discount' => 2,
            'total' => 9.5,
        ]);

        $this->assertSame('10.00', $order->subtotal);
        $this->assertSame('1.50', $order->tax);
        $this->assertSame('2.00', $order->discount);
        $this->assertSame('9.50', $order->total);
    }
}
