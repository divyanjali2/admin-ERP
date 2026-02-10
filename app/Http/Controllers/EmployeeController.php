<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeAddress;
use App\Models\EmployeeContact;
use App\Models\EmployeeJob;
use App\Models\LeavePolicy;
use App\Models\JobTitle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        // For DataGrid: keep it flat + simple
        $employees = Employee::query()
            ->select([
                'employee_id',
                'employee_code',
                'first_name',
                'last_name',
                'employment_status',
            ])
            ->with([
                // Work email from contacts
                'contacts' => function ($q) {
                    $q->select('contact_id', 'employee_id', 'contact_type', 'contact_value', 'is_primary');
                },
                // Department/Job title from employee_job
                'job.department:department_id,name',
                'job.jobTitle:job_title_id,name',
            ])
            ->orderBy('last_updated_date', 'desc')
            ->get()
            ->map(function ($e) {
                $workEmail = optional(
                    $e->contacts->firstWhere('contact_type', 'Work_Email')
                )->contact_value;

                return [
                    'id' => $e->employee_id, // DataGrid needs "id"
                    'employee_code' => $e->employee_code,
                    'first_name' => $e->first_name,
                    'last_name' => $e->last_name,
                    'work_email' => $workEmail,
                    'department' => optional(optional($e->job)->department)->name,
                    'job_title' => optional(optional($e->job)->jobTitle)->name,
                    'employment_status' => $e->employment_status,
                ];
            });

        return Inertia::render('HRMS/Employees', [
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        return Inertia::render('HRMS/EmployeesCreate', [
        'departments' => Department::orderBy('name')->get(['department_id','name']),
        'jobTitles' => JobTitle::orderBy('name')->get(['job_title_id','name']),
        'leavePolicies' => LeavePolicy::orderBy('name')->get(['leave_policy_id','name']),
        'employees' => Employee::orderBy('first_name')->get(['employee_id','employee_code','first_name','last_name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // employees
            'employee_code' => ['required', 'string', 'max:50', 'unique:employees,employee_code'],
            'employment_status' => ['required', 'string', 'max:20'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', 'max:10'],
            'marital_status' => ['nullable', 'string', 'max:10'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'epf_number' => ['nullable', 'string', 'max:50', 'unique:employees,epf_number'],
            'attendance_type' => ['required', 'string', 'max:20'],

            // user
            'user_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'user_password' => ['required', 'string', 'min:8'],

            // employee_job
            'department_id' => ['required', 'integer', 'exists:departments,department_id'],
            'job_title_id' => ['required', 'integer', 'exists:job_titles,job_title_id'],
            'employment_type' => ['required', 'string', 'max:20'],
            'employment_level' => ['required', 'string', 'max:20'],
            'date_of_joining' => ['required', 'date'],
            'probation_end_date' => ['nullable', 'date', 'after_or_equal:date_of_joining'],
            'reporting_manager_id' => ['nullable', 'string', 'size:36', 'exists:employees,employee_id'],
            'work_location_id' => ['required', 'integer'], // make it exists:work_locations,id when you add that table

            // contacts
            'work_email' => ['required', 'email', 'max:255'],
            'personal_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],

            // address (residential)
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['user_password']),
            ]);

            $employee = Employee::create([
                'employee_code' => $validated['employee_code'],
                'user_id' => $user->id,

                'employment_status' => $validated['employment_status'],
                'date_created' => now(),

                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],

                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'marital_status' => $validated['marital_status'] ?? null,

                'nationality' => $validated['nationality'] ?? null,
                'blood_group' => $validated['blood_group'] ?? null,
                'epf_number' => $validated['epf_number'] ?? null,

                'attendance_type' => $validated['attendance_type'],

                'created_by_user_id' => auth()->id(),
                'last_updated_by_user_id' => auth()->id(),
                'last_updated_date' => now(),
            ]);

            EmployeeJob::create([
                'employee_id' => $employee->employee_id,
                'department_id' => $validated['department_id'],
                'job_title_id' => $validated['job_title_id'],
                'employment_type' => $validated['employment_type'],
                'employment_level' => $validated['employment_level'],
                'date_of_joining' => $validated['date_of_joining'],
                'probation_end_date' => $validated['probation_end_date'] ?? null,
                'reporting_manager_id' => $validated['reporting_manager_id'] ?? null,
                'work_location_id' => $validated['work_location_id'],
            ]);

            // Contacts (normalized)
            EmployeeContact::create([
                'employee_id' => $employee->employee_id,
                'contact_type' => 'Work_Email',
                'contact_value' => $validated['work_email'],
                'is_primary' => true,
            ]);

            if (!empty($validated['personal_email'])) {
                EmployeeContact::create([
                    'employee_id' => $employee->employee_id,
                    'contact_type' => 'Personal_Email',
                    'contact_value' => $validated['personal_email'],
                    'is_primary' => false,
                ]);
            }

            if (!empty($validated['phone'])) {
                EmployeeContact::create([
                    'employee_id' => $employee->employee_id,
                    'contact_type' => 'Phone',
                    'contact_value' => $validated['phone'],
                    'is_primary' => true,
                ]);
            }

            // Address (Residential)
            EmployeeAddress::create([
                'employee_id' => $employee->employee_id,
                'address_type' => 'Residential',
                'address_line_1' => $validated['address_line_1'],
                'address_line_2' => $validated['address_line_2'] ?? null,
                'city' => $validated['city'],
                'state' => $validated['state'],
                'country' => $validated['country'],
                'postal_code' => $validated['postal_code'],
                'is_current' => true,
            ]);
        });

        return redirect()->route('hrms.employees.index')->with('success', 'Employee created successfully.');
    }

    public function destroy(Employee $employee)
    {
        // Deletes employee + cascades to: job/contacts/addresses/etc if FK cascadeOnDelete exists
        DB::transaction(function () use ($employee) {
            // Optionally delete linked user too (only if you want that behavior)
            // $userId = $employee->user_id;

            $employee->delete();

            // if ($userId) User::whereKey($userId)->delete();
        });

        return redirect()->back()->with('success', 'Employee removed successfully.');
    }
}
