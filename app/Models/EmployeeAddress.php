<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeAddress extends Model
{
    protected $table = 'employee_addresses';
    protected $primaryKey = 'employee_address_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_id','address_type',
        'address_line_1','address_line_2',
        'city','state','country','postal_code',
        'is_current'
    ];

    protected $casts = ['is_current' => 'boolean'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
