<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeavePolicy extends Model
{
    protected $primaryKey = 'leave_policy_id';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'leave_policy_id', 'leave_policy_id');
    }

    public function leaveBalances()
    {
        return $this->hasMany(EmployeeLeaveBalance::class, 'leave_policy_id', 'leave_policy_id');
    }
}
