<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('principal_reference_documents', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('principal_name');
            $table->string('file_name')->nullable()->after('document_number');
            $table->string('file_path')->nullable()->after('file_name');
            $table->string('program_name')->nullable()->change();
            $table->date('expired_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('principal_reference_documents', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'file_name', 'file_path']);
            $table->string('program_name')->nullable(false)->change();
            $table->date('expired_date')->nullable(false)->change();
        });
    }
};
