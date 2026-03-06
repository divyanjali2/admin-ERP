<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ChaufferApiController extends Controller
{
    public function index()
    {
        $chauffers = DB::table('employee_job as ej')
            ->join('employees as e', 'e.employee_id', '=', 'ej.employee_id')
            ->leftJoin('employee_contacts as ec', function ($join) {
                $join->on('ec.employee_id', '=', 'e.employee_id')
                     ->where('ec.contact_type', 'Whatsapp Number');
            })
            ->where('ej.job_title_id', 10)
            ->select(
                'e.employee_id as employee_id',
                'e.preferred_name',
                'ec.contact_value as whatsapp_number'
            )
            ->orderBy('e.preferred_name')
            ->get();

        return response()->json($chauffers);
    }
}