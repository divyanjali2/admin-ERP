<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobTitle extends Model
{
    protected $primaryKey = 'job_title_id';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function employeeJobs()
    {
        return $this->hasMany(EmployeeJob::class, 'job_title_id', 'job_title_id');
    }
}
