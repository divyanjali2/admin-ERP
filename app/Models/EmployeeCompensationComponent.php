<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeCompensationComponent extends Model
{
    protected $table = 'employee_compensation_components';
    protected $primaryKey = 'component_id';
    public $timestamps = false;

    protected $fillable = ['comp_id','component_type','component_name','amount'];

    protected $casts = ['amount' => 'decimal:2'];

    public function compensation()
    {
        return $this->belongsTo(EmployeeCompensation::class, 'comp_id', 'comp_id');
    }
}
