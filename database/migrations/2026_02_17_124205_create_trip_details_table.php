<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trip_details', function (Blueprint $table) {
            $table->id('trip_detail_id');
            $table->unsignedBigInteger('transport_service_id');

            $table->dateTime('trip_start_datetime');
            $table->dateTime('trip_end_datetime')->nullable();

            $table->integer('trip_start_odometer');
            $table->integer('trip_end_odometer')->nullable();

            $table->string('trip_start_odometer_photo', 500);
            $table->string('trip_end_odometer_photo', 500)->nullable();

            $table->decimal('start_trip_fuel', 5, 2)->nullable();
            $table->decimal('end_trip_fuel', 5, 2)->nullable();

            $table->timestamps();

            $table->foreign('transport_service_id')
                ->references('id')
                ->on('transport_services')
                ->onDelete('cascade');

            $table->index('transport_service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_details');
    }
};