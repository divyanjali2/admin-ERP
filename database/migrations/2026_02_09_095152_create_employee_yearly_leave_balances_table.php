<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_yearly_leave_balance', function (Blueprint $table) {
            $table->char('employee_id', 36);
            $table->unsignedBigInteger('leave_policy_id');

            $table->integer('annual_leave_balance');
            $table->integer('sick_leave_balance');

            $table->primary(['employee_id', 'leave_policy_id']);

            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            $table->foreign('leave_policy_id')->references('leave_policy_id')->on('leave_policies')->restrictOnDelete();

            $table->index('leave_policy_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_yearly_leave_balance');
    }
};
