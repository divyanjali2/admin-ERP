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
                ['name' => 'Human Resources'],
                ['name' => 'Information Technology'],
                ['name' => 'Finance'],
                ['name' => 'Operations'],
                ['name' => 'Sales'],
                ['name' => 'Marketing'],
                ['name' => 'Customer Support'],
                ['name' => 'Administration'],
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
                ['name' => 'HR Manager'],
                ['name' => 'HR Executive'],
                ['name' => 'Software Engineer'],
                ['name' => 'Senior Software Engineer'],
                ['name' => 'Team Lead'],
                ['name' => 'Project Manager'],
                ['name' => 'QA Engineer'],
                ['name' => 'System Administrator'],
                ['name' => 'Accountant'],
                ['name' => 'Finance Manager'],
                ['name' => 'Operations Manager'],
                ['name' => 'Sales Executive'],
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
                ['name' => 'Sick Leave'],
                ['name' => 'Casual Leave'],
                ['name' => 'Maternity Leave'],
                ['name' => 'Paternity Leave'],
                ['name' => 'No Pay Leave'],
                ['name' => 'Compassionate Leave'],
                ['name' => 'Study Leave'],
            ],
            ['name'],
            ['name']
        );
    }
}
