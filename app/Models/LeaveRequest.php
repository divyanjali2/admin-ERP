<?php

namespace App\Models;

use App\Enums\LeaveRequestStatus;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $table = 'leave_requests';
    protected $primaryKey = 'leave_request_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_id','leave_policy_id',
        'leave_start_date','leave_end_date',
        'number_of_days','reason',
        'oversee_member_id','is_special_request',
        'address','status',
        'requested_at','updated_at','half_day_session','manager_comment','reliever_comment'
    ];

    protected $casts = [
        'leave_start_date' => 'date',
        'leave_end_date' => 'date',
        'number_of_days' => 'decimal:2',
        'is_special_request' => 'boolean',
        'requested_at' => 'datetime',
        'updated_at' => 'datetime',
        'status' => LeaveRequestStatus::class,
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function policy()
    {
        return $this->belongsTo(LeavePolicy::class, 'leave_policy_id', 'leave_policy_id');
    }

    public function overseeMember()
    {
        return $this->belongsTo(Employee::class, 'oversee_member_id', 'employee_id');
    }

    public function documents()
    {
        return $this->hasMany(LeaveRequestDocument::class, 'leave_request_id', 'leave_request_id');
    }
}
