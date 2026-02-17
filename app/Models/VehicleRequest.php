<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleRequest extends Model
{
    protected $table = 'vehicle_requests';
    protected $primaryKey = 'vehicle_request_id';

    protected $fillable = [
        'employee_id',
        'vehicle_reg_no',
        'start_date',
        'is_one_day',
        'end_date',
        'reason',
        'manager_id',
        'status',
        'destinations',
        'trip_code',
        'reject_reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'start_date' => 'date',
        'is_one_day' => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function job()
    {
        return $this->hasOne(EmployeeJob::class, 'employee_id', 'employee_id');
    }

    // public function vehicle()
    // {
    //     return $this->belongsTo(Vehicle::class, 'vehicle_id', 'vehicle_id');
    // }
}
