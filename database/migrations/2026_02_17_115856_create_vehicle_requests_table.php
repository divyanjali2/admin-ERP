<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicle_requests', function (Blueprint $table) {
            $table->id('vehicle_request_id');
            $table->unsignedBigInteger('employee_id');
            $table->string('vehicle_reg_no', 50)->nullable();
            $table->dateTime('start_date');
            $table->boolean('is_one_day')->default(false);
            $table->dateTime('end_date')->nullable();
            $table->enum('reason', ['Shuttle','Transport','Office','Personal',])->default('Shuttle');
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->enum('status', ['PENDING','APPROVED','REJECTED','CANCELLED',])->default('PENDING');
            $table->text('destinations'); 
            $table->string('trip_code', 50)->unique();
            $table->string('reject_reason', 255)->nullable();
            $table->timestamps();
            $table->foreign('employee_id')->references('employee_id')->on('employees')->onDelete('cascade');
            $table->foreign('manager_id')->references('employee_id')->on('employees')->nullOnDelete();
            $table->index(['employee_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_requests');
    }
};
