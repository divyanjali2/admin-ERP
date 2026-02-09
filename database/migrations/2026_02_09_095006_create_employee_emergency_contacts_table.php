<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_emergency_contacts', function (Blueprint $table) {
            $table->id('emergency_contact_id');
            $table->char('employee_id', 36);

            $table->string('name', 150);
            $table->string('relationship', 100);
            $table->string('phone', 30);
            $table->string('address', 255)->nullable();

            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            $table->index('employee_id', 'idx_emg_emp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_emergency_contacts');
    }
};
