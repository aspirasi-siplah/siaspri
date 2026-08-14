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
        Schema::create('principal_reference_documents', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id')->unique();
            $table->string('principal_name');
            $table->string('document_number');
            $table->string('program_name');
            $table->string('category_name');
            $table->string('status', 20)->default('active'); // active, inactive, expired
            $table->date('expired_date');
            $table->timestamps();

            $table->index('principal_name');
            $table->index('program_name');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('principal_reference_documents');
    }
};
