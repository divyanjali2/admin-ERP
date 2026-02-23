<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequestDocument extends Model
{
    protected $table = 'leave_request_documents';
    protected $primaryKey = 'leave_request_document_id';
    public $timestamps = false;

    protected $fillable = [
        'leave_request_id','file_name','file_path',
        'mime_type','file_size_bytes','uploaded_at'
    ];

    protected $casts = [
        'file_size_bytes' => 'integer',
        'uploaded_at' => 'datetime',
    ];

    public function leaveRequest()
    {
        return $this->belongsTo(LeaveRequest::class, 'leave_request_id', 'leave_request_id');
    }
}
