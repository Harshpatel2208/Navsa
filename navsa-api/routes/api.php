<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AdminController;
use App\Models\Category;
use App\Models\Brand;
use App\Models\SubCategory;
use App\Http\Controllers\Api\ShippingController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Products (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Categories — only categories that have at least one product
Route::get('/categories', function () {
    return Category::whereHas('products')
        ->orderBy('category_name')
        ->get(['id', 'category_name']);
});

// Sub-categories (all)
Route::get('/sub-categories', function () {
    return SubCategory::where('status', 1)
        ->orderBy('sub_category_name')
        ->get(['id', 'category_id', 'sub_category_name', 'group_code']);
});

// Sub-categories by main category ID
Route::get('/sub-categories/{categoryId}', function ($categoryId) {
    return SubCategory::where('category_id', $categoryId)
        ->where('status', 1)
        ->orderBy('sub_category_name')
        ->get(['id', 'category_id', 'sub_category_name', 'group_code']);
});

// Brands — only brands that have at least one product
Route::get('/brands', function () {
    return Brand::whereHas('products')
        ->orderBy('brand_name')
        ->get(['id', 'brand_name']);
});

// Shipping
Route::get('/shipping/containers', [ShippingController::class, 'containers']);
Route::get('/shipping/countries', [ShippingController::class, 'countries']);
Route::get('/shipping/ports/{country}', [ShippingController::class, 'ports']);

// ── Admin Routes (protected by X-Admin-Key: navsa2024 header) ─────────────
Route::prefix('admin')->group(function () {

    // Dashboard
    Route::get('/stats', [AdminController::class, 'stats']);

    // Products CRUD + stock + delete
    Route::get('/products',                        [AdminController::class, 'products']);
    Route::post('/products',                       [AdminController::class, 'createProduct']);
    Route::put('/products/{id}',                   [AdminController::class, 'updateProduct']);
    Route::patch('/products/{id}/toggle-web',      [AdminController::class, 'toggleWeb']);
    Route::patch('/products/{id}/toggle-offer',    [AdminController::class, 'toggleOffer']);
    Route::patch('/products/{id}/stock',           [AdminController::class, 'updateStock']);
    Route::patch('/products/{id}/soft-delete',     [AdminController::class, 'softDeleteProduct']);
    Route::patch('/products/{id}/restore',         [AdminController::class, 'restoreProduct']);
    Route::delete('/products/{id}',                [AdminController::class, 'hardDeleteProduct']);

    // Users
    Route::get('/users',                           [AdminController::class, 'users']);
    Route::put('/users/{id}',                      [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}',                   [AdminController::class, 'deleteUser']);

    // Brands CRUD + delete
    Route::get('/brands',                          [AdminController::class, 'brands']);
    Route::post('/brands',                         [AdminController::class, 'createBrand']);
    Route::put('/brands/{id}',                     [AdminController::class, 'updateBrand']);
    Route::patch('/brands/{id}/soft-delete',       [AdminController::class, 'softDeleteBrand']);
    Route::delete('/brands/{id}',                  [AdminController::class, 'hardDeleteBrand']);

    // Categories CRUD + delete
    Route::get('/categories',                      [AdminController::class, 'categories']);
    Route::post('/categories',                     [AdminController::class, 'createCategory']);
    Route::put('/categories/{id}',                 [AdminController::class, 'updateCategory']);
    Route::patch('/categories/{id}/soft-delete',   [AdminController::class, 'softDeleteCategory']);
    Route::delete('/categories/{id}',              [AdminController::class, 'hardDeleteCategory']);
});