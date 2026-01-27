<?php

namespace App\Services\Orders;

use InvalidArgumentException;

class OrderTotalsCalculator
{
    /**
     * @param array<int, array{quantity:int|float|string, price:int|float|string}> $items
     * @return array{subtotal:float,tax:float,discount:float,total:float}
     */
    public function calculate(array $items, float $taxRate = 0.1, float $discount = 0.0): array
    {
        if ($taxRate < 0.0) {
            throw new InvalidArgumentException('Tax rate must be >= 0');
        }

        if ($discount < 0.0) {
            throw new InvalidArgumentException('Discount must be >= 0');
        }

        $subtotal = 0.0;
        foreach ($items as $index => $item) {
            if (!is_array($item)) {
                throw new InvalidArgumentException("Item at index {$index} must be an array");
            }

            if (!array_key_exists('quantity', $item) || !array_key_exists('price', $item)) {
                throw new InvalidArgumentException("Item at index {$index} must contain quantity and price");
            }

            $quantity = (float) $item['quantity'];
            $price = (float) $item['price'];

            if ($quantity < 0.0) {
                throw new InvalidArgumentException("Item at index {$index} has negative quantity");
            }

            if ($price < 0.0) {
                throw new InvalidArgumentException("Item at index {$index} has negative price");
            }

            $subtotal += $quantity * $price;
        }

        $tax = $subtotal * $taxRate;
        $total = $subtotal + $tax - $discount;

        return [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
        ];
    }
}
