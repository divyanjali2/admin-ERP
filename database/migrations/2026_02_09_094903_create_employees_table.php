<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->bigIncrements('employee_id');
            $table->string('employee_code', 50)->nullable()->unique();

            $table->string('employment_status', 20); 
            $table->dateTime('date_created');

            $table->string('surname', 100);
            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('last_name', 100);

            $table->date('date_of_birth');
            $table->string('gender', 10); 
            $table->string('marital_status', 10)->nullable(); 

            $table->string('nationality', 100)->nullable();
            $table->string('blood_group', 10)->nullable();

            $table->string('epf_number', 50)->nullable();

            $table->string('attendance_type', 20); 
            $table->char('created_by', 36);
            $table->char('last_updated_by', 36);
            $table->dateTime('last_updated_date');

            $table->index(['last_name', 'first_name'], 'idx_emp_name');
            $table->index(['employment_status'], 'idx_emp_status');
            $table->unique(['epf_number'], 'uq_epf_number'); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
