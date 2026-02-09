<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $primaryKey = 'department_id';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function employeeJobs()
    {
        return $this->hasMany(EmployeeJob::class, 'department_id', 'department_id');
    }
}
