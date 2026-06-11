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
        Schema::create('blacklist_merchants', function (Blueprint $table) {
            $table->id();
            $table->string('merchant_name');
            // $table->string('merchant_owner')->nullable();
            // $table->string('merchant_phone')->nullable();
            // $table->string('merchant_address')->nullable();
            $table->text('image')->nullable();
            $table->text('reason');
            $table->string('status', 10)->default('active'); // active, revoked
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blacklist_merchants');
    }
};
