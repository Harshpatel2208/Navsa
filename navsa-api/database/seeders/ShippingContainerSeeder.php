<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingContainerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('shipping_containers')->delete();

        DB::table('shipping_containers')->insert([
            [
                'id' => 1,
                'container_name' => '20ft Dry Van',
                'container_type' => 'Dry',
                'volume_m3' => 33.20,
                'payload_weight_kg' => 25000.00,
                'gross_weight_kg' => 28200.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'container_name' => '40ft Dry Van',
                'container_type' => 'Dry',
                'volume_m3' => 67.70,
                'payload_weight_kg' => 26300.00,
                'gross_weight_kg' => 28800.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'container_name' => '40ft High Cube',
                'container_type' => 'Dry',
                'volume_m3' => 76.40,
                'payload_weight_kg' => 26300.00,
                'gross_weight_kg' => 28800.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'container_name' => '20ft Reefer (Refrigerated)',
                'container_type' => 'Reefer',
                'volume_m3' => 28.30,
                'payload_weight_kg' => 22000.00,
                'gross_weight_kg' => 25400.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'container_name' => '40ft Reefer (Refrigerated)',
                'container_type' => 'Reefer',
                'volume_m3' => 59.30,
                'payload_weight_kg' => 26000.00,
                'gross_weight_kg' => 29200.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'container_name' => 'Collection / Ex Works (No container calculations)',
                'container_type' => 'Dry',
                'volume_m3' => 0.00,
                'payload_weight_kg' => 0.00,
                'gross_weight_kg' => 0.00,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
