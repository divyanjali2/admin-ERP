<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_addresses', function (Blueprint $table) {
            $table->id('employee_address_id');
            $table->unsignedBigInteger('employee_id')->nullable();

            $table->string('address_type', 20); // Residential/Emergency/Other
            $table->string('address_line_1', 255);
            $table->string('city', 100);
            $table->string('country', 100);
            $table->string('postal_code', 20)->nullable();

            $table->boolean('is_current')->default(true);

            $table->foreign('employee_id')
                ->references('employee_id')->on('employees')
                ->nullOnDelete();            
            $table->index('employee_id', 'idx_addr_emp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_addresses');
    }
};
