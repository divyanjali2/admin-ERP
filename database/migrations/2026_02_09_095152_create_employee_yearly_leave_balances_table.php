<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_yearly_leave_balance', function (Blueprint $table) {
            $table->unsignedBigInteger('employee_id'); 
            $table->unsignedBigInteger('leave_policy_id');

            $table->integer('leave_entitlement');

            $table->primary(['employee_id', 'leave_policy_id']);

            $table->foreign('employee_id')
                ->references('employee_id')->on('employees')
                ->onDelete('cascade');

            $table->foreign('leave_policy_id')
                ->references('leave_policy_id')->on('leave_policies')
                ->onDelete('restrict');

            $table->index('leave_policy_id');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('employee_yearly_leave_balance');
    }
};
