<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ShippingController extends Controller
{
    public function containers()
    {
        return DB::table('shipping_containers')
            ->where('active',1)
            ->orderBy('id')
            ->get();
    }

    public function countries()
    {
        return DB::table('shipping_countries')
            ->where('active',1)
            ->orderBy('country_name')
            ->get();
    }

    public function ports($countryId)
    {
        return DB::table('shipping_ports')
            ->where('country_id',$countryId)
            ->where('active',1)
            ->orderBy('port_name')
            ->get();
    }
}