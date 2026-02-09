<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id('employee_document_id');
            $table->char('employee_id', 36);

            $table->string('doc_type', 30);
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size_bytes')->nullable();
            $table->dateTime('uploaded_at');

            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();

            $table->index('employee_id', 'idx_doc_emp');
            $table->index(['employee_id', 'doc_type'], 'idx_doc_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
    }
};
