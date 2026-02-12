<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_contacts', function (Blueprint $table) {
            $table->id('contact_id');
            $table->unsignedBigInteger('employee_id')->nullable();

            $table->string('contact_type', 30);  
            $table->string('contact_value', 255);
            $table->boolean('is_primary')->default(false);

            $table->foreign('employee_id')
                ->references('employee_id')->on('employees')
                ->nullOnDelete();
            $table->index('employee_id', 'idx_contact_emp');
            // $table->unique(['employee_id', 'contact_type', 'contact_value'], 'uq_emp_contact');
            // $table->unique(['contact_type', 'contact_value'], 'uq_work_email_global');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_contacts');
    }
};
