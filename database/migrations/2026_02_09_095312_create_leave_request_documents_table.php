<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leave_request_documents', function (Blueprint $table) {
            $table->id('leave_request_document_id');
            $table->unsignedBigInteger('leave_request_id');

            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size_bytes')->nullable();
            $table->dateTime('uploaded_at');

            $table->foreign('leave_request_id')->references('leave_request_id')->on('leave_requests')->cascadeOnDelete();
            $table->index('leave_request_id', 'idx_leave_req_docs');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_request_documents');
    }
};
