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
        Schema::create('reseller_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('principal_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('processing');
            $table->json('result')->nullable();
            $table->timestamps();
            $table->index(['principal_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reseller_imports');
    }
};
