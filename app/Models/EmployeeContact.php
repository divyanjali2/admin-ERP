<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeContact extends Model
{
    protected $table = 'employee_contacts';
    protected $primaryKey = 'contact_id';
    public $timestamps = false;

    protected $fillable = ['employee_id','contact_type','contact_value','is_primary'];

    protected $casts = ['is_primary' => 'boolean'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
