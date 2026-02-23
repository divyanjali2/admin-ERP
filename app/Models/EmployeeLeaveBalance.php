<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeLeaveBalance extends Model
{
    protected $table = 'employee_leave_balances';
    protected $primaryKey = 'leave_balance_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_id','leave_policy_id',
        'total_taken','remaining','updated_at'
    ];

    protected $casts = [
        'total_taken' => 'decimal:2',
        'remaining' => 'decimal:2',
        'updated_at' => 'datetime',
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
