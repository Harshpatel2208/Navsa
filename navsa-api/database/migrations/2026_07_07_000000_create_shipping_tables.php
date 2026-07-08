<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_containers', function (Blueprint $table) {
            $table->id();
            $table->string('container_name');
            $table->string('container_type')->default('Dry');
            $table->decimal('volume_m3', 8, 2);
            $table->decimal('payload_weight_kg', 10, 2);
            $table->decimal('gross_weight_kg', 10, 2);
            $table->tinyInteger('active')->default(1);
            $table->timestamps();
        });

        Schema::create('shipping_countries', function (Blueprint $table) {
            $table->id();
            $table->integer('zone_id')->default(1);
            $table->string('country_name');
            $table->string('country_code', 5)->default('XX');
            $table->tinyInteger('active')->default(1);
            $table->timestamps();
        });

        Schema::create('shipping_ports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained('shipping_countries')->onDelete('cascade');
            $table->string('port_name');
            $table->tinyInteger('active')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_ports');
        Schema::dropIfExists('shipping_countries');
        Schema::dropIfExists('shipping_containers');
    }
};
