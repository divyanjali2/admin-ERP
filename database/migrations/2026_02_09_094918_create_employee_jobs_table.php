<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_job', function (Blueprint $table) {
            $table->char('employee_id', 36)->primary();

            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('job_title_id');

            $table->string('employment_type', 20);  
            $table->string('employment_level', 20); 

            $table->date('date_of_joining');
            $table->date('probation_end_date')->nullable();

            $table->char('reporting_manager_id', 36)->nullable();
            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            $table->foreign('department_id')->references('department_id')->on('departments')->restrictOnDelete();
            $table->foreign('job_title_id')->references('job_title_id')->on('job_titles')->restrictOnDelete();
            $table->foreign('reporting_manager_id')->references('employee_id')->on('employees')->nullOnDelete();

            $table->index('department_id');
            $table->index('job_title_id');
            $table->index('reporting_manager_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_job');
    }
};
