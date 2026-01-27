<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Orders\OrderTotalsCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(private readonly OrderTotalsCalculator $totalsCalculator)
    {
    }

    public function index()
    {
        $orders = Order::with(['user', 'store', 'orderItems.product'])
            ->withCount('orderItems as items_count')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
            'customer_address' => 'nullable|string',
            'store_id' => 'nullable|exists:stores,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $discount = (float) ($request->discount ?? 0);
            $totals = $this->totalsCalculator->calculate($request->items, 0.1, $discount);

            $order = Order::create([
                'order_number' => 'ORD-' . time() . '-' . rand(1000, 9999),
                'user_id' => Auth::id(),
                'store_id' => $request->store_id,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'customer_address' => $request->customer_address,
                'subtotal' => $totals['subtotal'],
                'tax' => $totals['tax'],
                'discount' => $totals['discount'],
                'total' => $totals['total'],
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_status ?? 'pending',
                'order_status' => 'pending',
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['quantity'] * $item['price'],
                ]);
            }

            return response()->json($order->load('orderItems.product'), 201);
        });
    }

    public function show($id)
    {
        $order = Order::with(['user', 'store', 'orderItems.product'])->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'payment_status' => 'sometimes|string',
            'order_status' => 'sometimes|string',
            'notes' => 'nullable|string',
        ]);

        $order->update($request->all());

        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
}
