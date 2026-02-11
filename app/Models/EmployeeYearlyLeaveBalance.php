<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeYearlyLeaveBalance extends Model
{
    protected $table = 'employee_yearly_leave_balance';
    public $timestamps = false;

    protected $fillable = [
        'employee_id','leave_policy_id',
        'leave_entitlement'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function policy()
    {
        return $this->belongsTo(LeavePolicy::class, 'leave_policy_id', 'leave_policy_id');
    }
}
