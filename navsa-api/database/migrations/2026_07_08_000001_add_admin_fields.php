<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add offer fields to products
        if (!Schema::hasColumn('products', 'is_offer')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('is_offer')->default(false)->after('obsolete');
                $table->string('offer_label', 80)->nullable()->after('is_offer');
            });
        }

        // Add status + extra fields to users
        if (!Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('company_name', 200)->nullable()->after('name');
                $table->string('phone', 30)->nullable()->after('company_name');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved')->after('phone');
                $table->timestamp('approved_at')->nullable()->after('status');
            });
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_offer', 'offer_label']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'phone', 'status', 'approved_at']);
        });
    }
};
