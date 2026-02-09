<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeEmergencyContact extends Model
{
    protected $table = 'employee_emergency_contacts';
    protected $primaryKey = 'emergency_contact_id';
    public $timestamps = false;

    protected $fillable = ['employee_id','name','relationship','phone','address'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
