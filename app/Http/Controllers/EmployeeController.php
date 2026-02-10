<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeAddress;
use App\Models\EmployeeContact;
use App\Models\EmployeeJob;
use App\Models\LeavePolicy;
use App\Models\EmployeeBankAccount;
use App\Models\JobTitle;
use App\Models\EmployeeYearlyLeaveBalance;
use App\Models\EmployeeEmergencyContact;
use App\Models\EmployeeExperience;
use App\Models\EmployeeCompensation;
use App\Models\EmployeeCompensationComponent;
use App\Models\EmployeeDocument;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class EmployeeController extends Controller
{
    public function index()
    {
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
                                    'employment_level' => $e->job->employment_level ?? null,

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
        Log::channel('single')->info('EMPLOYEE STORE: incoming request', [
            'content_type' => $request->header('Content-Type'),
            'has_files' => count($request->allFiles()) > 0,
            'all_keys' => array_keys($request->all()),
            'payload_preview' => $request->except([
                'user_password',
                'employee_documents',
            ]),
            'files' => collect($request->allFiles())->map(function ($v, $k) {
                return is_array($v) ? "array_files" : get_class($v);
            })->toArray(),
        ]);

        try {
            $validated = $request->validate([
                // 'employee_code' => ['required', 'string', 'max:50', 'unique:employees,employee_code'],
                'employment_status' => ['required', 'string', 'max:20'],
                'surname' => ['required', 'string', 'max:100'],
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

                'user_email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'user_password' => ['required', 'string', 'min:8'],

                'department_id' => ['required', 'integer', 'exists:departments,department_id'],
                'job_title_id' => ['required', 'integer', 'exists:job_titles,job_title_id'],
                'employment_type' => ['required', 'string', 'max:20'],
                'employment_level' => ['required', 'string', 'max:20'],
                'date_of_joining' => ['required', 'date'],
                'probation_end_date' => ['nullable', 'date', 'after_or_equal:date_of_joining'],
                'reporting_manager_id' => ['nullable', 'integer', 'exists:employees,employee_id'],

                'contacts' => ['required', 'array', 'min:1'],
                'contacts.*.contact_type' => ['required', 'string', 'max:30'],
                'contacts.*.contact_value' => ['required', 'string', 'max:255'],
                'contacts.*.is_primary' => ['nullable', 'boolean'],

                'addresses' => ['required', 'array', 'min:1'],
                'addresses.*.address_type' => ['required', 'string', 'max:20'],
                'addresses.*.address_line_1' => ['required', 'string', 'max:255'],
                'addresses.*.address_line_2' => ['nullable', 'string', 'max:255'],
                'addresses.*.city' => ['required', 'string', 'max:100'],
                'addresses.*.state' => ['required', 'string', 'max:100'],
                'addresses.*.country' => ['required', 'string', 'max:100'],
                'addresses.*.postal_code' => ['required', 'string', 'max:20'],
                'addresses.*.is_current' => ['nullable', 'boolean'],

                'emergency_contacts' => ['nullable', 'array'],
                'emergency_contacts.*.name' => ['required_with:emergency_contacts', 'string', 'max:150'],
                'emergency_contacts.*.relationship' => ['required_with:emergency_contacts', 'string', 'max:100'],
                'emergency_contacts.*.phone' => ['required_with:emergency_contacts', 'string', 'max:30'],
                'emergency_contacts.*.address' => ['nullable', 'string', 'max:255'],

                'experience' => ['nullable', 'array'],
                'experience.*.previous_employer' => ['required_with:experience', 'string', 'max:150'],
                'experience.*.total_years' => ['nullable', 'numeric'],

                'bank_accounts' => ['nullable', 'array'],
                'bank_accounts.*.bank_name' => ['required_with:bank_accounts', 'string', 'max:150'],
                'bank_accounts.*.bank_account_number' => ['required_with:bank_accounts', 'string', 'max:50'],
                'bank_accounts.*.bank_branch_name' => ['nullable', 'string', 'max:150'],

                'compensation' => ['nullable', 'array'],
                'compensation.salary_currency' => ['required_with:compensation', 'string', 'size:3'],
                'compensation.pay_frequency' => ['required_with:compensation', 'string', 'max:10'],
                'compensation.effective_from' => ['nullable', 'date'],
                'compensation.effective_to' => ['nullable', 'date', 'after_or_equal:compensation.effective_from'],
                'compensation.components' => ['nullable', 'array'],
                'compensation.components.*.component_type' => ['required_with:compensation.components', 'string', 'max:10'],
                'compensation.components.*.component_name' => ['required_with:compensation.components', 'string', 'max:120'],
                'compensation.components.*.amount' => ['required_with:compensation.components', 'numeric'],

                'yearly_leave' => ['nullable', 'array'],
                'yearly_leave.leave_policy_id' => ['nullable', 'integer', 'exists:leave_policies,leave_policy_id'],
                'yearly_leave.leave_entitlement' => ['nullable', 'integer'],

                'employee_documents' => ['nullable', 'array'],
                'employee_documents.*.doc_type' => ['required_with:employee_documents', 'string', 'max:30'],
                'employee_documents.*.file' => ['nullable', 'file', 'max:10240'],
            ]);

            Log::channel('single')->info('EMPLOYEE STORE: validation ok', [
                'validated_keys' => array_keys($validated),
            ]);

            DB::beginTransaction();

            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['user_password']),
            ]);

            Log::channel('single')->info('EMPLOYEE STORE: user created', ['user_id' => $user->id]);

            $employee = Employee::create([
                // 'employee_code' => 001,
                'user_id' => $user->id,
                'employment_status' => $validated['employment_status'],
                'date_created' => now(),
                'surname' => $validated['surname'],
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
                'created_by' => auth()->id(),
                'last_updated_by' => auth()->id(),
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
            ]);

            foreach (($validated['bank_accounts'] ?? []) as $b) {
                // skip empty rows
                if (empty($b['bank_name']) && empty($b['bank_account_number'])) continue;

                EmployeeBankAccount::create([
                    'employee_id'          => $employee->employee_id,
                    'bank_name'            => $b['bank_name'],
                    'bank_account_number'  => $b['bank_account_number'],
                    'bank_branch_name'     => $b['bank_branch_name'] ?? null,
                ]);
            }

            foreach (($validated['emergency_contacts'] ?? []) as $ec) {
                // skip empty row
                if (empty($ec['name']) && empty($ec['phone'])) continue;

                EmployeeEmergencyContact::create([
                    'employee_id'   => $employee->employee_id,
                    'name'          => $ec['name'],
                    'relationship'  => $ec['relationship'],
                    'phone'         => $ec['phone'],
                    'address'       => $ec['address'] ?? null,
                ]);
            }

            foreach (($validated['experience'] ?? []) as $ex) {
                if (empty($ex['previous_employer'])) continue;

                EmployeeExperience::create([
                    'employee_id'        => $employee->employee_id,
                    'previous_employer'  => $ex['previous_employer'],
                    'total_years'        => $ex['total_years'] ?? null,
                ]);
            }

            if (!empty($validated['yearly_leave']['leave_policy_id'] ?? null)) {
                EmployeeYearlyLeaveBalance::updateOrCreate(
                    [
                        'employee_id'     => $employee->employee_id,
                        'leave_policy_id' => $validated['yearly_leave']['leave_policy_id'],
                        'leave_entitlement' => (int)($validated['yearly_leave']['leave_entitlement'] ?? 0),
                    ],
                );
            }


            if (!empty($validated['compensation'] ?? null)) {
                $comp = $validated['compensation'];

                $compensation = EmployeeCompensation::create([
                    'employee_id'     => $employee->employee_id,
                    'salary_currency' => $comp['salary_currency'],
                    'pay_frequency'   => $comp['pay_frequency'],
                    'effective_from'  => $comp['effective_from'] ?? null,
                    'effective_to'    => $comp['effective_to'] ?? null,
                ]);

                foreach (($comp['components'] ?? []) as $cc) {
                    if (empty($cc['component_name']) || $cc['amount'] === '' || $cc['amount'] === null) continue;

                    EmployeeCompensationComponent::create([
                        'comp_id' => $compensation->comp_id, // adjust column name
                        'component_type'           => $cc['component_type'],
                        'component_name'           => $cc['component_name'],
                        'amount'                   => $cc['amount'],
                    ]);
                }
            }

            foreach (($validated['employee_documents'] ?? []) as $i => $doc) {
                /** @var \Illuminate\Http\UploadedFile|null $file */
                $file = $doc['file'] ?? null;

                // skip empty row
                if (empty($doc['doc_type']) && !$file) continue;

                $path = null;
                $originalName = null;
                $mime = null;
                $size = null;

                if ($file) {
                    $path = $file->store("employees/{$employee->employee_id}/documents", 'public');
                    $originalName = $file->getClientOriginalName();
                    $mime = $file->getClientMimeType();
                    $size = $file->getSize();
                }

                EmployeeDocument::create([
                    'employee_id'    => $employee->employee_id,
                    'doc_type'       => $doc['doc_type'],
                    'file_name'      => $doc['doc_type'],        
                    'file_path'      => $path,         
                    'original_name'  => $originalName, 
                    'mime_type'      => $mime,         
                    'file_size_bytes' => $size,      
                    'uploaded_at'      => now(),          
                ]);
            }


            // Contacts (normalized)
            foreach ($validated['contacts'] as $c) {
                EmployeeContact::create([
                    'employee_id'   => $employee->employee_id,
                    'contact_type'  => $c['contact_type'],
                    'contact_value' => $c['contact_value'],
                    'is_primary'    => (bool)($c['is_primary'] ?? false),
                ]);
            }

            // Address (Residential)
            foreach ($validated['addresses'] as $a) {
                EmployeeAddress::create([
                    'employee_id'      => $employee->employee_id,
                    'address_type'     => $a['address_type'],
                    'address_line_1'   => $a['address_line_1'],
                    'address_line_2'   => $a['address_line_2'] ?? null,
                    'city'             => $a['city'],
                    'state'            => $a['state'],
                    'country'          => $a['country'],
                    'postal_code'      => $a['postal_code'],
                    'is_current'       => (bool)($a['is_current'] ?? false),
                ]);
            }

            $employee->employee_code = 'EPF-' . str_pad((string)$employee->employee_id, 6, '0', STR_PAD_LEFT);
            $employee->save();

            Log::channel('single')->info('EMPLOYEE STORE: employee created', ['employee_id' => $employee->employee_id]);

            // ... keep the rest of your creates as-is ...

            DB::commit();

            Log::channel('single')->info('EMPLOYEE STORE: committed OK', ['employee_id' => $employee->employee_id]);

            return redirect()->route('hrms.employees.index')->with('success', 'Employee created successfully.');
        }
        catch (ValidationException $e) {
            Log::channel('single')->warning('EMPLOYEE STORE: validation failed', [
                'errors' => $e->errors(),
            ]);
            throw $e;
        }
        catch (\Throwable $e) {
            DB::rollBack();

            Log::channel('single')->error('EMPLOYEE STORE: exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => collect($e->getTrace())->take(10)->toArray(),
            ]);

            throw $e; // keep it so you see the error in dev
        }
    }

    public function show(Employee $employee)
{
    $employee->load([
        'job.department',
        'job.jobTitle',
        'contacts',
        'addresses',
        'emergencyContacts',
        'bankAccounts',
        'experiences',
        'documents',
        'leaveBalances',      // adjust name if different
        'compensations.components', // adjust if different relationship
    ]);

    return inertia('HRMS/Employees/Show', [
        'employee' => $employee,
    ]);
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
