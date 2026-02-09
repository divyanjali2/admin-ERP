<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_compensation', function (Blueprint $table) {
            $table->id('comp_id');
            $table->char('employee_id', 36);

            $table->char('salary_currency', 3); // ISO
            $table->string('pay_frequency', 10); // Monthly/Weekly

            $table->date('effective_from');
            $table->date('effective_to')->nullable();

            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();

            $table->index('employee_id', 'idx_comp_emp');
            $table->index(['employee_id', 'effective_from'], 'idx_comp_effective');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_compensation');
    }
};
