<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    private function applyOrderScope($query, Request $request)
    {
        // scope=paid (default) OR scope=completed
        $scope = $request->get('scope', 'paid');

        if ($scope === 'completed') {
            $query->where('payment_status', 'paid')
                ->where('order_status', 'completed');
        } else {
            $query->where('payment_status', 'paid');
        }

        return $query;
    }

    private function applyDateAndStoreFilters($query, Request $request)
    {
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $start = Carbon::parse($request->start_date)->startOfDay();
            $end = Carbon::parse($request->end_date)->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        return $query;
    }

    public function sales(Request $request)
    {
        $query = Order::with(['user', 'store'])
            ->where('payment_status', 'paid');

        $this->applyDateAndStoreFilters($query, $request);

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

        $query = Product::query()
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.total) as revenue')
            )
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id');

        $this->applyOrderScope($query, $request);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $start = Carbon::parse($request->start_date)->startOfDay();
            $end = Carbon::parse($request->end_date)->endOfDay();
            $query->whereBetween('orders.created_at', [$start, $end]);
        }

        if ($request->filled('store_id')) {
            $query->where('orders.store_id', $request->store_id);
        }

        $topProducts = $query
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('units_sold')
            ->limit($limit)
            ->get();

        return response()->json($topProducts);
    }

    public function revenue(Request $request)
    {
        $period = $request->get('period', 'month');
        $limit = (int) $request->get('limit', 12);
        
        $driver = DB::getDriverName();
        $periodExpr = null;

        if ($driver === 'sqlite') {
            $dateFormat = match ($period) {
                'day' => '%Y-%m-%d',
                'week' => '%Y-%W',
                'month' => '%Y-%m',
                'year' => '%Y',
                default => '%Y-%m',
            };
            $periodExpr = "strftime('$dateFormat', created_at)";
        } else {
            $dateFormat = match ($period) {
                'day' => '%Y-%m-%d',
                'week' => '%Y-%u',
                'month' => '%Y-%m',
                'year' => '%Y',
                default => '%Y-%m',
            };
            $periodExpr = "DATE_FORMAT(created_at, '$dateFormat')";
        }

        $query = Order::query()
            ->select(
                DB::raw("$periodExpr as period"),
                DB::raw('SUM(total) as total_revenue'),
                DB::raw('COUNT(*) as order_count')
            );

        $this->applyOrderScope($query, $request);

        $this->applyDateAndStoreFilters($query, $request);

        $revenue = $query
            ->groupBy('period')
            ->orderBy('period', 'asc')
            ->limit($limit)
            ->get();

        return response()->json($revenue);
    }
}
