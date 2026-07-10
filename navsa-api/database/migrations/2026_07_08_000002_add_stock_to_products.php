<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('products', 'stock_quantity')) {
            Schema::table('products', function (Blueprint $table) {
                $table->integer('stock_quantity')->default(0)->after('offer_label');
                $table->boolean('deleted')->default(false)->after('stock_quantity');
            });
        }

        // Also add deleted soft-flag to brands and categories
        if (!Schema::hasColumn('brands', 'deleted')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->boolean('deleted')->default(false)->after('status');
            });
        }
        if (!Schema::hasColumn('categories', 'deleted')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->boolean('deleted')->default(false)->after('status');
            });
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['stock_quantity', 'deleted']);
        });
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn('deleted');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('deleted');
        });
    }
};
