<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trip_details', function (Blueprint $table) {
            $table->id('trip_detail_id');
            $table->unsignedBigInteger('vehicle_request_id');
            $table->dateTime('trip_start_datetime');
            $table->dateTime('trip_end_datetime')->nullable();
            $table->integer('trip_start_odometer');
            $table->integer('trip_end_odometer')->nullable();
            $table->string('trip_start_odometer_photo', 500);
            $table->string('trip_end_odometer_photo', 500)->nullable();
            $table->timestamps();
            $table->foreign('vehicle_request_id')->references('vehicle_request_id')->on('vehicle_requests')->onDelete('cascade');
            $table->index('vehicle_request_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_details');
    }
};
