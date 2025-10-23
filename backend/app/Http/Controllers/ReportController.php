<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $query = Order::with(['user', 'store'])
            ->where('payment_status', 'paid');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        if ($request->has('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        $orders = $query->get();
        
        $totalSales = $orders->sum('total');
        $totalOrders = $orders->count();
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        return response()->json([
            'orders' => $orders,
            'summary' => [
                'totalSales' => $totalSales,
                'totalOrders' => $totalOrders,
                'averageOrderValue' => $averageOrderValue,
            ],
        ]);
    }

    public function inventory(Request $request)
    {
        $query = Product::with(['category', 'brand', 'stores']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->has('low_stock') && $request->low_stock) {
            $query->where('quantity', '<=', DB::raw('min_quantity'))
                  ->where('min_quantity', '>', 0);
        }

        $products = $query->get();
        
        $totalProducts = $products->count();
        $totalValue = $products->sum(function($product) {
            return $product->quantity * $product->cost;
        });
        $lowStockCount = Product::where('quantity', '<=', DB::raw('min_quantity'))
            ->where('min_quantity', '>', 0)
            ->count();

        return response()->json([
            'products' => $products,
            'summary' => [
                'totalProducts' => $totalProducts,
                'totalValue' => $totalValue,
                'lowStockCount' => $lowStockCount,
            ],
        ]);
    }

    public function topProducts(Request $request)
    {
        $limit = $request->get('limit', 10);

        $topProducts = Product::select('products.*', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->with(['category', 'brand'])
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($topProducts);
    }

    public function revenue(Request $request)
    {
        $period = $request->get('period', 'month');
        
        $dateFormat = match($period) {
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            'year' => '%Y',
            default => '%Y-%m',
        };

        $revenue = Order::select(
            DB::raw("DATE_FORMAT(created_at, '$dateFormat') as period"),
            DB::raw('SUM(total) as total_revenue'),
            DB::raw('COUNT(*) as order_count')
        )
        ->where('payment_status', 'paid')
        ->groupBy('period')
        ->orderBy('period', 'desc')
        ->limit(12)
        ->get();

        return response()->json($revenue);
    }
}
