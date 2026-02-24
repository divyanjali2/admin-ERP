<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        /*
        |--------------------------------------------------------------------------
        | Departments
        |--------------------------------------------------------------------------
        */
        DB::table('departments')->upsert(
            [
                ['name' => 'Senior Management'],
                ['name' => 'HR'],
                ['name' => 'IT Department'],
                ['name' => 'FINANCE'],
                ['name' => 'Marketing Department'],
                ['name' => 'Rent a Car Department'],
                ['name' => 'Digital Marketing Department'],
                ['name' => 'Transfers Department'],
                ['name' => 'Airport Parking'],
                ['name' => 'Fleet Management Department'],
                ['name' => 'Procurement Department'],
            ],
            ['name'], 
            ['name']  
        );

        /*
        |--------------------------------------------------------------------------
        | Job Titles
        |--------------------------------------------------------------------------
        */
        DB::table('job_titles')->upsert(
            [
                ['name' => 'Managing Director'],
                ['name' => 'General Manager'],
                ['name' => 'Head of Department'],
                ['name' => 'Software Engineer'],
                ['name' => 'Accountant'],
                ['name' => 'Finance Manager'],
                ['name' => 'Operations Manager'],
                ['name' => 'Sales Manager'],
                ['name' => 'Marketing Executive'],
            ],
            ['name'],
            ['name']
        );

        /*
        |--------------------------------------------------------------------------
        | Leave Policies
        |--------------------------------------------------------------------------
        */
        DB::table('leave_policies')->upsert(
            [
                ['name' => 'Annual Leave'],
                ['name' => 'Medical Leave'],
                ['name' => 'Casual Leave'],
                ['name' => 'Half Day'],
            ],
            ['name'],
            ['name']
        );
    }
}
