<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // Users
    Route::apiResource('users', UserController::class);
    
    // Groups
    Route::apiResource('groups', GroupController::class);
    
    // Brands
    Route::apiResource('brands', BrandController::class);
    
    // Categories
    Route::apiResource('categories', CategoryController::class);
    
    // Stores
    Route::apiResource('stores', StoreController::class);
    
    // Attributes
    Route::apiResource('attributes', AttributeController::class);
    
    // Products
    Route::apiResource('products', ProductController::class);
    
    // Orders
    Route::apiResource('orders', OrderController::class);
    
    // Company
    Route::get('/company', [CompanyController::class, 'index']);
    Route::post('/company', [CompanyController::class, 'store']);
    Route::put('/company/{id}', [CompanyController::class, 'update']);
    
    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::get('/settings/{key}', [SettingController::class, 'show']);
    Route::put('/settings/{key}', [SettingController::class, 'update']);
    Route::delete('/settings/{key}', [SettingController::class, 'destroy']);
    
    // Reports
    Route::get('/reports/sales', [ReportController::class, 'sales']);
    Route::get('/reports/inventory', [ReportController::class, 'inventory']);
    Route::get('/reports/top-products', [ReportController::class, 'topProducts']);
    Route::get('/reports/revenue', [ReportController::class, 'revenue']);
});
