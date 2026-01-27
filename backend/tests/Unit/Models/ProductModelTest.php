<?php

namespace Tests\Unit\Models;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductModelTest extends TestCase
{
    #[Test]
    public function it_defines_expected_relationships(): void
    {
        $product = new Product();

        $this->assertInstanceOf(BelongsTo::class, $product->category());
        $this->assertInstanceOf(BelongsTo::class, $product->brand());
        $this->assertInstanceOf(BelongsToMany::class, $product->stores());
        $this->assertInstanceOf(BelongsToMany::class, $product->attributes());
        $this->assertInstanceOf(HasMany::class, $product->orderItems());

        $this->assertSame((new Category())->getTable(), $product->category()->getRelated()->getTable());
        $this->assertSame((new Brand())->getTable(), $product->brand()->getRelated()->getTable());
        $this->assertSame('product_store', $product->stores()->getTable());
        $this->assertSame('product_attribute', $product->attributes()->getTable());
    }

    #[Test]
    public function it_casts_price_and_cost_as_decimal_strings(): void
    {
        $product = new Product(['price' => 10, 'cost' => 5]);

        $this->assertSame('10.00', $product->price);
        $this->assertSame('5.00', $product->cost);
    }
}
