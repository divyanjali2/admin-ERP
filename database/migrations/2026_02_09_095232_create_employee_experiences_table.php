<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_experience', function (Blueprint $table) {
            $table->id('experience_id');
            $table->unsignedBigInteger('employee_id')->nullable();

            $table->string('previous_employer', 150);
            $table->decimal('total_years', 5, 2)->nullable();

            $table->foreign('employee_id')
                ->references('employee_id')->on('employees')
                ->nullOnDelete();
            $table->index('employee_id', 'idx_exp_emp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_experience');
    }
};
