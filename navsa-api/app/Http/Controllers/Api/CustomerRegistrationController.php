<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\CustomerDetail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerRegistrationController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Create the user with status = pending
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'company_name' => $request->account_name ?? $request->registered_company_name,
                'phone' => $request->mobile ?? $request->registered_phone,
                'status' => 'pending',
            ]);

            // Create customer details
            CustomerDetail::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'region' => $request->region,
                'country' => $request->country,
                'position' => $request->position,
                'trading_years' => $request->trading_years,
                'business_nature' => $request->business_nature,
                'website' => $request->website,
                'director_name' => $request->director_name,
                'currency' => $request->currency,
                'mobile' => $request->mobile,
                'address_line_1' => $request->address_line_1,
                'address_line_2' => $request->address_line_2,
                'city' => $request->city,
                'province' => $request->province,
                'zip_code' => $request->zip_code,
                'account_name' => $request->account_name,
                'account_email' => $request->account_email,
                'other_wholesalers' => $request->other_wholesalers,
                'average_order_value' => $request->average_order_value,
                'turnover' => $request->turnover,
                'import_full_containers' => $request->import_full_containers,
                'brands_interested' => $request->brands_interested,
                'categories_interested' => $request->categories_interested,
                'eori_number' => $request->eori_number,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Registration successful, pending admin approval.',
                'user' => $user
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred during registration.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
