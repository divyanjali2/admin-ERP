<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Employee extends Model
{
    use HasUuids;

    protected $primaryKey = 'employee_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'employee_id','employee_code','employment_status','date_created','surname',
        'first_name','middle_name','last_name',
        'date_of_birth','gender','marital_status',
        'nationality','blood_group','epf_number',
        'attendance_type',
        'created_by','last_updated_by','last_updated_date',
    ];

    protected $hidden = ['password'];

    public function job()
    {
        return $this->hasOne(EmployeeJob::class, 'employee_id', 'employee_id');
    }

    public function contacts()
    {
        return $this->hasMany(EmployeeContact::class, 'employee_id', 'employee_id');
    }

    public function addresses()
    {
        return $this->hasMany(EmployeeAddress::class, 'employee_id', 'employee_id');
    }

    public function emergencyContacts()
    {
        return $this->hasMany(EmployeeEmergencyContact::class, 'employee_id', 'employee_id');
    }

    public function compensations()
    {
        return $this->hasMany(EmployeeCompensation::class, 'employee_id', 'employee_id');
    }

    public function bankAccounts()
    {
        return $this->hasMany(EmployeeBankAccount::class, 'employee_id', 'employee_id');
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class, 'employee_id', 'employee_id');
    }

    public function certifications()
    {
        return $this->hasMany(EmployeeCertification::class, 'employee_id', 'employee_id');
    }

    public function experiences()
    {
        return $this->hasMany(EmployeeExperience::class, 'employee_id', 'employee_id');
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'employee_id', 'employee_id');
    }

    public function overseenLeaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'oversee_member_id', 'employee_id');
    }

    public function leaveBalances()
    {
        return $this->hasMany(EmployeeLeaveBalance::class, 'employee_id', 'employee_id');
    }
}
