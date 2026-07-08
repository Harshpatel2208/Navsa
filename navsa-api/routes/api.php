<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Models\Category;
use App\Models\Brand;
use App\Models\SubCategory;
use App\Http\Controllers\Api\ShippingController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Products
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