<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportService extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'source_id',
        'type',
        'vehicle_no',
        'chauffer_phone',
        'chauffer_name',
        'assigned_start_at',
        'assigned_end_at',
        'pickup_location',
        'dropoff_location',
        'passenger_count',
        'delete_note',
        'deleted_by',
    ];

    protected $casts = [
        'assigned_start_at' => 'datetime',
        'assigned_end_at' => 'datetime',
        'passenger_count' => 'integer',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function chauffer(): BelongsTo
    {
        return $this->belongsTo(Chauffer::class);
    }
}
