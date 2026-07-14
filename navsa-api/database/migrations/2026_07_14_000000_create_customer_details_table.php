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
        Schema::create('customer_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('region')->nullable();
            $table->string('country')->nullable();
            $table->string('position')->nullable();
            $table->string('trading_years')->nullable();
            $table->string('business_nature')->nullable();
            $table->string('website')->nullable();
            $table->string('director_name')->nullable();
            $table->string('currency')->nullable();
            $table->string('mobile')->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('account_name')->nullable();
            $table->string('account_email')->nullable();
            $table->string('other_wholesalers')->nullable();
            $table->string('average_order_value')->nullable();
            $table->string('turnover')->nullable();
            $table->string('import_full_containers')->nullable();
            $table->text('brands_interested')->nullable();
            $table->json('categories_interested')->nullable();
            $table->string('eori_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_details');
    }
};
