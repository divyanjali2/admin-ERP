<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transport_services', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('source_id');
            $table->enum('type', ['shuttle', 'transfers', 'office', 'personal']);

            $table->string('vehicle_no', 50)->nullable();
            $table->string('chauffer_phone', 20)->nullable();
            $table->string('chauffer_name')->nullable();

            $table->unsignedBigInteger('employee_id')->nullable();
            $table->unsignedBigInteger('manager_id')->nullable();

            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'])
                  ->default('PENDING');

            $table->string('reject_reason', 500)->nullable();

            $table->dateTime('assigned_start_at');
            $table->string('pickup_location')->default('Seeduwa Office');
            $table->string('dropoff_location');

            $table->dateTime('assigned_end_at')->nullable();

            $table->unsignedInteger('passenger_count');

            $table->string('trip_code')->nullable();
            $table->string('delete_note')->nullable();

            $table->timestamps();

            $table->dateTime('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->index('source_id');
            $table->index('employee_id');
            $table->index('manager_id');
            $table->index('status');
            $table->index('assigned_start_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_services');
    }
};