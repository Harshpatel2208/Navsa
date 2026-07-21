<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SupplierDetail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SupplierRegistrationController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'company_name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'company_name' => $request->company_name,
                'phone' => $request->mobile_phone ?? $request->business_phone,
                'status' => 'pending',
                'role' => 'supplier',
            ]);

            // Create supplier details
            SupplierDetail::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email_address' => $request->email,
                'mobile_phone' => $request->mobile_phone,
                'business_phone' => $request->business_phone,
                'company_name' => $request->company_name,
                'company_type' => $request->company_type,
                'company_registration_number' => $request->company_registration_number,
                'website_url' => $request->website_url,
                'address_line_1' => $request->address_line_1,
                'address_line_2' => $request->address_line_2,
                'city' => $request->city,
                'county' => $request->county,
                'country' => $request->country,
                'postcode' => $request->postcode,
                'additional_comments' => $request->additional_comments,
                'categories_supplied' => $request->categories_supplied,
                'consent_news' => filter_var($request->consent_news, FILTER_VALIDATE_BOOLEAN),
                'consent_marketing' => filter_var($request->consent_marketing, FILTER_VALIDATE_BOOLEAN),
                'contact_time' => $request->contact_time,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Supplier registration successful, pending admin approval.',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Supplier Registration Error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'message' => 'An error occurred during supplier registration. Please try again later.'
            ], 500);
        }
    }
}
