<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'category', 'subCategory', 'supplier'])
            ->where('deleted', false)
            ->where('live_for_web', 1);

        if ($request->filled('search')) {

            $search = trim($request->search);

            $query->where(function ($q) use ($search) {

                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhere('barcode_ean', 'like', "%{$search}%")
                    ->orWhere('group_desc', 'like', "%{$search}%")

                    ->orWhereHas('brand', function ($b) use ($search) {
                        $b->where('brand_name', 'like', "%{$search}%");
                    })

                    ->orWhereHas('category', function ($c) use ($search) {
                        $c->where('category_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('category')) {

            $category = trim($request->category);

            $query->whereHas('category', function ($q) use ($category) {
                $q->where('category_name', 'like', "%{$category}%");
            });
        }

        if ($request->filled('sub_category')) {

            $subCategory = trim($request->sub_category);

            $query->whereHas('subCategory', function ($q) use ($subCategory) {
                $q->where('sub_category_name', 'like', "%{$subCategory}%");
            });
        }

        if ($request->filled('brand')) {

            $brand = trim($request->brand);

            $query->whereHas('brand', function ($q) use ($brand) {
                $q->where('brand_name', 'like', "%{$brand}%");
            });
        }

        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('sub_category_id')) {
            $query->where('sub_category_id', $request->sub_category_id);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortBy = $request->get('sort_by', 'id');
        $order = strtolower($request->get('order', 'asc'));

        $allowedSorts = [
            'id',
            'price',
            'cost',
            'description',
            'reference',
            'created_at'
        ];

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        if (!in_array($order, ['asc', 'desc'])) {
            $order = 'asc';
        }

        $query->orderBy($sortBy, $order);

        $products = $query->paginate(
            $request->get('per_page', 20)
        );

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with([
            'brand',
            'category',
            'subCategory',
            'supplier'
        ])
            ->where('deleted', false)
            ->where('live_for_web', 1)
            ->findOrFail($id);

        return response()->json($product);
    }
}