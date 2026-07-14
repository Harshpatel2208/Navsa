<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    private const ADMIN_KEY = 'navsa2024';

    private function auth(Request $request): bool
    {
        $key = $request->header('X-Admin-Key') ?? $request->query('admin_key');
        return $key === self::ADMIN_KEY;
    }

    private function deny()
    {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        if ($user->status !== 'approved') {
            return response()->json(['message' => 'Your account is pending approval by the admin.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

    public function stats(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        return response()->json([
            'total_products'   => Product::where('deleted', false)->count(),
            'live_products'    => Product::where('deleted', false)->where('live_for_web', 1)->count(),
            'hidden_products'  => Product::where('deleted', false)->where(function ($q) {
                $q->where('live_for_web', 0)->orWhereNull('live_for_web');
            })->count(),
            'offer_products'   => Product::where('deleted', false)->where('is_offer', 1)->count(),
            'low_stock'        => Product::where('deleted', false)->where('stock_quantity', '<=', 5)->count(),
            'out_of_stock'     => Product::where('deleted', false)->where('stock_quantity', 0)->count(),
            'total_brands'     => Brand::where('deleted', false)->count(),
            'total_categories' => Category::where('deleted', false)->count(),
            'total_users'      => User::count(),
            'pending_users'    => User::where('status', 'pending')->count(),
            'approved_users'   => User::where('status', 'approved')->count(),
            'rejected_users'   => User::where('status', 'rejected')->count(),
        ]);
    }

    // Registrations
    public function getRegistrations(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $registrations = User::with('customerDetail')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($registrations);
    }

    public function approveRegistration(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::findOrFail($id);
        if ($user->status !== 'pending') {
            return response()->json(['error' => 'User is not pending approval'], 400);
        }

        $user->status = 'approved';
        $user->approved_at = now();
        $user->save();

        return response()->json(['message' => 'Registration approved successfully', 'user' => $user]);
    }

    // ── Products ──────────────────────────────────────────────────────────────

    public function products(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $q = Product::with(['brand', 'category']);

        // Exclude hard-deleted by default unless asked
        if (!$request->filled('show_deleted')) {
            $q->where('deleted', false);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(function ($sub) use ($s) {
                $sub->where('description', 'like', "%$s%")
                    ->orWhere('reference', 'like', "%$s%")
                    ->orWhere('barcode_ean', 'like', "%$s%");
            });
        }
        if ($request->filled('brand_id'))     $q->where('brand_id', $request->brand_id);
        if ($request->filled('category_id'))  $q->where('category_id', $request->category_id);
        if ($request->filled('is_offer'))     $q->where('is_offer', $request->is_offer);
        if ($request->filled('live_for_web')) $q->where('live_for_web', $request->live_for_web);
        if ($request->filled('low_stock'))    $q->where('stock_quantity', '<=', 5);

        return $q->orderBy('id', 'desc')->paginate((int)$request->get('per_page', 25));
    }

    public function createProduct(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::create($request->except(['admin_key']));
        return response()->json($product->load(['brand', 'category']), 201);
    }

    public function updateProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update($request->except(['admin_key']));
        return response()->json($product->fresh(['brand', 'category']));
    }

    public function toggleWeb(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $new = $product->live_for_web ? 0 : 1;
        $product->update(['live_for_web' => $new]);
        return response()->json(['id' => $id, 'live_for_web' => $new]);
    }

    public function toggleOffer(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $new = $product->is_offer ? 0 : 1;
        $data = ['is_offer' => $new];
        if ($request->filled('offer_label')) $data['offer_label'] = $request->offer_label;
        if (!$new) $data['offer_label'] = null; // Clear label when removing offer
        $product->update($data);
        return response()->json(['id' => $id, 'is_offer' => $new, 'offer_label' => $product->offer_label]);
    }

    public function updateStock(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update([
            'stock_quantity' => (int)$request->stock_quantity,
            'price'          => $request->has('price') ? $request->price : $product->price,
            'price_list'     => $request->has('price_list') ? $request->price_list : $product->price_list,
        ]);
        return response()->json($product->fresh());
    }

    // Soft-delete a product (marks deleted=true)
    public function softDeleteProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update(['deleted' => true, 'live_for_web' => 0]);
        return response()->json(['id' => $id, 'deleted' => true]);
    }

    // Hard-delete a product (permanent)
    public function hardDeleteProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Product::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // Restore a soft-deleted product
    public function restoreProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update(['deleted' => false]);
        return response()->json(['id' => $id, 'deleted' => false]);
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    public function users(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $q = User::query();
        if ($request->filled('status')) $q->where('status', $request->status);
        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(function ($sub) use ($s) {
                $sub->where('name', 'like', "%$s%")
                    ->orWhere('email', 'like', "%$s%")
                    ->orWhere('company_name', 'like', "%$s%");
            });
        }
        return $q->orderBy('created_at', 'desc')->paginate(25);
    }

    public function updateUser(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $user = User::findOrFail($id);
        $data = $request->only(['status', 'company_name', 'phone']);
        if (isset($data['status']) && $data['status'] === 'approved') {
            $data['approved_at'] = now();
        }
        $user->update($data);
        return response()->json($user->fresh());
    }

    public function deleteUser(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        User::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // ── Brands ────────────────────────────────────────────────────────────────

    public function brands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $q = Brand::withCount('products');
        if (!$request->filled('show_deleted')) {
            $q->where(function ($sub) { $sub->where('deleted', false)->orWhereNull('deleted'); });
        }
        return $q->orderBy('brand_name')->get();
    }

    public function createBrand(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $brand = Brand::create(['brand_name' => trim($request->brand_name), 'status' => 1, 'deleted' => false]);
        return response()->json($brand->loadCount('products'), 201);
    }

    public function updateBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $brand = Brand::findOrFail($id);
        $brand->update($request->only(['brand_name', 'status']));
        return response()->json($brand->loadCount('products'));
    }

    public function softDeleteBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Brand::findOrFail($id)->update(['deleted' => true, 'status' => 0]);
        return response()->json(['id' => $id, 'deleted' => true]);
    }

    public function hardDeleteBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Brand::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // ── Categories ────────────────────────────────────────────────────────────

    public function categories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $q = Category::withCount('products');
        if (!$request->filled('show_deleted')) {
            $q->where(function ($sub) { $sub->where('deleted', false)->orWhereNull('deleted'); });
        }
        return $q->orderBy('category_name')->get();
    }

    public function createCategory(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $cat = Category::create(['category_name' => trim($request->category_name), 'status' => 1, 'deleted' => false]);
        return response()->json($cat->loadCount('products'), 201);
    }

    public function updateCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $cat = Category::findOrFail($id);
        $cat->update($request->only(['category_name', 'status']));
        return response()->json($cat->loadCount('products'));
    }

    public function softDeleteCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Category::findOrFail($id)->update(['deleted' => true, 'status' => 0]);
        return response()->json(['id' => $id, 'deleted' => true]);
    }

    public function hardDeleteCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Category::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }
}
