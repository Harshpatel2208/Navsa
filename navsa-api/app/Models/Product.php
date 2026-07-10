<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        // Core identifiers
        'reference',
        'description',
        'supplier_id',
        'category_id',
        'sub_category_id',
        'brand_id',

        // Quantities / units
        'units_of',
        'inner_case_quantity',
        'outer_case_quantity',
        'qty_desc',

        // Barcodes
        'barcode_ean',
        'barcode_case',

        // Classification (raw, before brand/category lookup)
        'group_desc',
        'vat_code',

        // Pallet/logistics
        'layer_quantity',
        'pallet_quantity',
        'supplier_reference',

        // Pricing
        'cost',
        'cost_from_date',
        'cost_to_date',
        'price_list',
        'price',
        'from_date',
        'to_date',

        // Physical attributes
        'weight',
        'volume',
        'shelf_life',
        'bbd',

        // Trade/customs
        'comm_code',
        'intra_country',
        'intra_type',

        // Web-specific
        'web_short_description',
        'web_long_description',
        'web_image',
        'live_for_web',
        'encore_image',
        'obsolete',

        // Admin-managed
        'is_offer',
        'offer_label',
        'stock_quantity',
        'deleted',
    ];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function subCategory() {
        return $this->belongsTo(SubCategory::class);
    }

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }
}