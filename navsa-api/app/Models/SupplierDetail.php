<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierDetail extends Model
{
    use HasFactory;

    protected $table = 'supplier_details';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email_address',
        'mobile_phone',
        'business_phone',
        'company_name',
        'company_type',
        'company_registration_number',
        'website_url',
        'address_line_1',
        'address_line_2',
        'city',
        'county',
        'country',
        'postcode',
        'additional_comments',
        'categories_supplied',
        'consent_news',
        'consent_marketing',
        'contact_time',
    ];

    protected $casts = [
        'categories_supplied' => 'array',
        'contact_time'        => 'array',
        'consent_news'        => 'boolean',
        'consent_marketing'   => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
