<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('customer_details') && !Schema::hasColumn('customer_details', 'same_as_billing')) {
            Schema::table('customer_details', function (Blueprint $table) {
                $table->boolean('same_as_billing')->default(true)->after('zip_code');
                $table->string('shipping_address_line_1')->nullable()->after('same_as_billing');
                $table->string('shipping_address_line_2')->nullable()->after('shipping_address_line_1');
                $table->string('shipping_city')->nullable()->after('shipping_address_line_2');
                $table->string('shipping_province')->nullable()->after('shipping_city');
                $table->string('shipping_zip_code')->nullable()->after('shipping_province');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_details', function (Blueprint $table) {
            $table->dropColumn([
                'same_as_billing',
                'shipping_address_line_1',
                'shipping_address_line_2',
                'shipping_city',
                'shipping_province',
                'shipping_zip_code'
            ]);
        });
    }
};
