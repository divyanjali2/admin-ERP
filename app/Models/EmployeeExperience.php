<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeExperience extends Model
{
    protected $table = 'employee_experience';
    protected $primaryKey = 'experience_id';
    public $timestamps = false;

    protected $fillable = ['employee_id','previous_employer','total_years'];

    protected $casts = ['total_years' => 'decimal:2'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
