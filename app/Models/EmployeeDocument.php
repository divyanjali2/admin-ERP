<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDocument extends Model
{
    protected $table = 'employee_documents';
    protected $primaryKey = 'employee_document_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_id','doc_type','file_name','file_path',
        'mime_type','file_size_bytes','uploaded_at'
    ];

    protected $casts = [
        'file_size_bytes' => 'integer',
        'uploaded_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
