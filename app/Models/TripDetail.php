<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripDetail extends Model
{
    protected $table = 'trip_details';
    protected $primaryKey = 'trip_detail_id';

    protected $fillable = [
        'transport_service_id',
        'trip_start_datetime',
        'trip_end_datetime',
        'trip_start_odometer',
        'trip_end_odometer',
        'trip_start_odometer_photo',
        'trip_end_odometer_photo',
    ];

    protected $casts = [
        'trip_start_datetime' => 'datetime',
        'trip_end_datetime'   => 'datetime',
    ];

    public function vehicleRequest()
    {
        return $this->belongsTo(VehicleRequest::class, 'vehicle_request_id', 'vehicle_request_id');
    }
}
