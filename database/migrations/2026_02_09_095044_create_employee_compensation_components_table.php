<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_compensation_components', function (Blueprint $table) {
            $table->id('component_id');
            $table->unsignedBigInteger('comp_id');

            $table->string('component_type', 10); // Basic/Allowance/Deduction
            $table->string('component_name', 120);
            $table->decimal('amount', 12, 2);

            $table->foreign('comp_id')->references('comp_id')->on('employee_compensation')->cascadeOnDelete();
            $table->index('comp_id', 'idx_comp_comp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_compensation_components');
    }
};
