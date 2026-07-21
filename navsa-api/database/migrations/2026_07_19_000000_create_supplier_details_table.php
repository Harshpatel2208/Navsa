<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Modify users.role column to VARCHAR(30) to support 'supplier'
        DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(30) DEFAULT 'customer'");

        // 2. Create supplier_details table
        if (!Schema::hasTable('supplier_details')) {
            Schema::create('supplier_details', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('first_name')->nullable();
                $table->string('last_name')->nullable();
                $table->string('email_address')->nullable();
                $table->string('mobile_phone')->nullable();
                $table->string('business_phone')->nullable();
                $table->string('company_name')->nullable();
                $table->string('company_type')->nullable();
                $table->string('company_registration_number')->nullable();
                $table->string('website_url')->nullable();
                $table->string('address_line_1')->nullable();
                $table->string('address_line_2')->nullable();
                $table->string('city')->nullable();
                $table->string('county')->nullable();
                $table->string('country')->nullable();
                $table->string('postcode')->nullable();
                $table->text('additional_comments')->nullable();
                $table->json('categories_supplied')->nullable();
                $table->boolean('consent_news')->default(false);
                $table->boolean('consent_marketing')->default(false);
                $table->json('contact_time')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_details');
    }
};
