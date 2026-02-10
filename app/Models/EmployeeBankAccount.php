<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeBankAccount extends Model
{
    protected $table = 'employee_bank_accounts';
    protected $primaryKey = 'bank_account_id';
    public $timestamps = false;

    protected $fillable = ['employee_id','bank_name','bank_account_number','bank_branch_name'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }
}
