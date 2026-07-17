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
        if (Schema::hasTable('products') && !Schema::hasColumn('products', 'is_best_offer')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('is_best_offer')->default(false)->after('obsolete');
                $table->boolean('is_new_arrival')->default(false)->after('is_best_offer');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_best_offer', 'is_new_arrival']);
        });
    }
};
