<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_bank_accounts', function (Blueprint $table) {
            $table->id('bank_account_id');
            $table->char('employee_id', 36);

            $table->string('bank_name', 150);
            $table->string('bank_account_number', 50);

            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            $table->index('employee_id', 'idx_bank_emp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_bank_accounts');
    }
};
