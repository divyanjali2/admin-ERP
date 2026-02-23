<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id('leave_request_id');

            $table->unsignedBigInteger('employee_id')->nullable();
            $table->unsignedBigInteger('leave_policy_id');

            $table->date('leave_start_date');
            $table->date('leave_end_date');
            $table->decimal('number_of_days', 5, 2);

            $table->string('reason', 500);
            $table->unsignedBigInteger('oversee_member_id')->nullable();
            $table->enum('half_day_session', ['MORNING', 'EVENING'])->nullable();
            $table->text('manager_comment')->nullable();
            $table->text('reliever_comment')->nullable();

            $table->boolean('is_special_request')->default(false);
            $table->string('address', 255)->nullable();
            $table->string('status', 30);
            $table->dateTime('requested_at');
            $table->dateTime('updated_at');

            $table->foreign('employee_id')
                ->references('employee_id')->on('employees')
                ->nullOnDelete();

            $table->foreign('leave_policy_id')
                ->references('leave_policy_id')->on('leave_policies')
                ->onDelete('restrict');

            $table->foreign('oversee_member_id')
                ->references('employee_id')->on('employees')
                ->nullOnDelete();

            $table->index(['employee_id', 'leave_start_date'], 'idx_leave_emp_start');
            $table->index('leave_policy_id', 'idx_leave_policy');
            $table->index('status', 'idx_leave_status');
            $table->index('oversee_member_id', 'idx_leave_oversee');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
