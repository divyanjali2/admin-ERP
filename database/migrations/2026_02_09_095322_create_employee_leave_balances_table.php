<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_leave_balances', function (Blueprint $table) {
            $table->id('leave_balance_id');

            $table->char('employee_id', 36);
            $table->unsignedBigInteger('leave_policy_id');

            $table->decimal('total_taken', 5, 2)->default(0);
            $table->decimal('remaining', 5, 2);

            $table->dateTime('updated_at');

            $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            $table->foreign('leave_policy_id')->references('leave_policy_id')->on('leave_policies')->restrictOnDelete();

            $table->index('employee_id', 'idx_lb_employee');
            $table->index('leave_policy_id', 'idx_lb_policy');
            $table->unique(['employee_id', 'leave_policy_id'], 'uq_lb_emp_policy');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_leave_balances');
    }
};
