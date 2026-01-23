<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $currentStart = $now->copy()->subDays(30);
        $previousStart = $now->copy()->subDays(60);
        $previousEnd = $currentStart;

        $pctChange = function ($current, $previous) {
            $current = (float) $current;
            $previous = (float) $previous;
            if ($previous == 0.0) {
                return null;
            }
            return (($current - $previous) / $previous) * 100.0;
        };

        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalUsers = User::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');

        $currentProducts = Product::whereBetween('created_at', [$currentStart, $now])->count();
        $previousProducts = Product::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $currentOrders = Order::whereBetween('created_at', [$currentStart, $now])->count();
        $previousOrders = Order::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $currentUsers = User::whereBetween('created_at', [$currentStart, $now])->count();
        $previousUsers = User::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $currentRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$currentStart, $now])
            ->sum('total');
        $previousRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->sum('total');
        
        $lowStockProducts = Product::query()
            ->whereNotNull('quantity')
            ->where('quantity', '<', 15)
            ->with(['category', 'brand'])
            ->orderBy('quantity')
            ->get();
        
        $recentOrders = Order::with(['user', 'store'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        $ordersByStatus = Order::select('order_status', DB::raw('count(*) as count'))
            ->groupBy('order_status')
            ->get();
        
        $topProducts = Product::query()
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sold')
            )
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.payment_status', 'paid')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalUsers' => $totalUsers,
                'totalRevenue' => $totalRevenue,
                'productsChangePct' => $pctChange($currentProducts, $previousProducts),
                'ordersChangePct' => $pctChange($currentOrders, $previousOrders),
                'usersChangePct' => $pctChange($currentUsers, $previousUsers),
                'revenueChangePct' => $pctChange($currentRevenue, $previousRevenue),
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'ordersByStatus' => $ordersByStatus,
            'topProducts' => $topProducts,
        ]);
    }
}
