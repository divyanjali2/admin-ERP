<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeCertification extends Model
{
    protected $table = 'employee_certifications';
    protected $primaryKey = 'certification_id';
    public $timestamps = false;

    protected $fillable = ['employee_id','name'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
