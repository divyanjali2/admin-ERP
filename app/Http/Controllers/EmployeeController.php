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
use Illuminate\Support\Str;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with([
                'contacts:contact_id,employee_id,contact_type,contact_value,is_primary',
                'job.department:department_id,name',
                'job.jobTitle:job_title_id,name',
            ])
            ->select([
                'employee_id',
                'employee_code',
                'first_name',
                'last_name',
                'employment_status',
            ])
            ->latest('last_updated_date')
            ->get()
            ->map(fn ($e) => [
                'id' => $e->employee_id,
                'employee_code' => $e->employee_code,
                'first_name' => $e->first_name,
                'last_name' => $e->last_name,                
                'employment_status' => $e->employment_status,
                'work_email' => $e->contacts
                    ->firstWhere('contact_type', 'Work_Email')
                    ?->contact_value,
                'department' => $e->job?->department?->name,
                'job_title' => $e->job?->jobTitle?->name,
                'employment_level' => $e->job?->employment_level,
            ]);

        return Inertia::render('HRMS/Employees', [
            'employees' => $employees,
            'isAdmin' => auth()->user()?->name === 'Admin',
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
                'user_password' => ['required', 'string', 'min:5'],

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
                'addresses.*.city' => ['required', 'string', 'max:100'],
                'addresses.*.country' => ['required', 'string', 'max:100'],
                'addresses.*.postal_code' => ['nullable', 'string', 'max:20'],
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
                'yearly_leave.*.leave_policy_id' => ['nullable', 'integer', 'exists:leave_policies,leave_policy_id'],
                'yearly_leave.*.leave_entitlement' => ['nullable', 'integer', 'min:0'],

                'employee_documents' => ['nullable','array'],
                'employee_documents.*.doc_type' => ['required','string','max:30'],
                'employee_documents.*.files' => ['nullable','array'],
                'employee_documents.*.files.*' => ['file','max:10240'],
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

            $user->employee_id = $employee->employee_id;
            $user->save();

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

            foreach (($validated['yearly_leave'] ?? []) as $yl) {
                if (empty($yl['leave_policy_id'])) continue;

                EmployeeYearlyLeaveBalance::updateOrCreate(
                    [
                        'employee_id'     => $employee->employee_id,
                        'leave_policy_id' => (int) $yl['leave_policy_id'],
                    ],
                    [
                        'leave_entitlement' => (int) ($yl['leave_entitlement'] ?? 0),
                    ]
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

            foreach (($validated['employee_documents'] ?? []) as $doc) {
                $files = $doc['files'] ?? [];

                if (count($files) === 0) continue;

                foreach ($files as $file) {
                    $empFolder = Str::slug(trim(($employee->first_name ?? '').' '.($employee->last_name ?? '')));
                    $docFolder = Str::slug($doc['doc_type'] ?? 'other');

                    if ($empFolder === '') $empFolder = 'employee-'.$employee->employee_id;

                    // store path
                    $dir = "employees/{$empFolder}/{$docFolder}";

                    $path = $file->store($dir, 'public');

                    EmployeeDocument::create([
                        'employee_id' => $employee->employee_id,
                        'doc_type' => $doc['doc_type'],
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'mime_type' => $file->getClientMimeType(),
                        'file_size_bytes' => $file->getSize(),
                        'uploaded_at' => now(),
                    ]);
                }
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
                    'city'             => $a['city'],
                    'country'          => $a['country'],
                    'postal_code'      => $a['postal_code'],
                    'is_current'       => (bool)($a['is_current'] ?? false),
                ]);
            }

            $employee->employee_code = 'EV-' . str_pad((string)$employee->employee_id, 6, '0', STR_PAD_LEFT);
            $employee->save();

            DB::commit();

            return redirect()
                ->route('hrms.employees.index')
                ->with('success', 'Employee created successfully.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::channel('single')->error('EMPLOYEE STORE FAILED', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // careful: trace is long, but very useful during debugging
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong while saving. Please try again.');
        }
    }

    public function show(Employee $employee)
    {
        $employee->load([
            'job.department',
            'job.jobTitle',
            'job.reportingManager',
            'contacts',
            'addresses',
            'emergencyContacts',
            'bankAccounts',
            'experiences',
            'documents',
            'yearlyLeaveBalances.policy',     // ✅ this
            'compensations.components',
        ]);


        return inertia('HRMS/EmployeesShow', [
            'employee' => $employee,
        ]);
    }

public function edit(Employee $employee)
{
    $employee->load([
        'user:id,email,employee_id',
        'job.department',
        'job.jobTitle',
        'job.reportingManager',
        'contacts',
        'addresses',
        'emergencyContacts',
        'bankAccounts',
        'experiences',
        'documents',
        'yearlyLeaveBalances' => function ($q) {
            $q->select(['employee_id','leave_policy_id','leave_entitlement']);
        },
        'yearlyLeaveBalances.policy:leave_policy_id,name',
        'compensations.components',
    ]);

    Log::info('EDIT yearly leave rows', [
    'employee_id' => $employee->employee_id,
    'count' => $employee->yearlyLeaveBalances()->count(),
    'rows' => $employee->yearlyLeaveBalances()->get()->toArray(),
]);


    return Inertia::render('HRMS/EmployeesEdit', [
        'employee' => $employee,
        'departments' => Department::orderBy('name')->get(['department_id','name']),
        'jobTitles' => JobTitle::orderBy('name')->get(['job_title_id','name']),
        'leavePolicies' => LeavePolicy::orderBy('name')->get(['leave_policy_id','name']),
        'employees' => Employee::orderBy('first_name')->get(['employee_id','employee_code','first_name','last_name']),
    ]);
}


    public function update(Request $request, Employee $employee)
    {
        Log::info('EMPLOYEE UPDATE: incoming', [
            'content_type' => $request->header('Content-Type'),
            'all_keys' => array_keys($request->all()),
        ]);

        $validated = $request->validate([
            'employment_status' => ['required','string','max:20'],
            'surname' => ['required','string','max:100'],
            'first_name' => ['required','string','max:100'],
            'middle_name' => ['nullable','string','max:100'],
            'last_name' => ['required','string','max:100'],
            'date_of_birth' => ['required','date'],
            'gender' => ['required','string','max:10'],
            'marital_status' => ['nullable','string','max:10'],
            'nationality' => ['nullable','string','max:100'],
            'blood_group' => ['nullable','string','max:10'],
            'epf_number' => [
                'nullable','string','max:50',
                Rule::unique('employees','epf_number')->ignore($employee->employee_id,'employee_id')
            ],
            'attendance_type' => ['required','string','max:20'],

            // user fields (optional)
            'user_email' => ['nullable','email','max:255'],
            'user_password' => ['nullable','string','min:6'],

            // job
            'department_id' => ['required','integer','exists:departments,department_id'],
            'job_title_id' => ['required','integer','exists:job_titles,job_title_id'],
            'employment_type' => ['required','string','max:20'],
            'employment_level' => ['required','string','max:20'],
            'date_of_joining' => ['required','date'],
            'probation_end_date' => ['nullable','date','after_or_equal:date_of_joining'],
            'reporting_manager_id' => ['nullable','integer','exists:employees,employee_id'],

            // contacts
            'contacts' => ['required','array','min:1'],
            'contacts.*.contact_type' => ['required','string','max:30'],
            'contacts.*.contact_value' => ['required','string','max:255'],
            'contacts.*.is_primary' => ['nullable','boolean'],

            // addresses
            'addresses' => ['required','array','min:1'],
            'addresses.*.address_type' => ['required','string','max:20'],
            'addresses.*.address_line_1' => ['required','string','max:255'],
            'addresses.*.city' => ['required','string','max:100'],
            'addresses.*.country' => ['required','string','max:100'],
            'addresses.*.postal_code' => ['nullable','string','max:20'],
            'addresses.*.is_current' => ['nullable','boolean'],

            // emergency (tolerant)
            'emergency_contacts' => ['nullable','array'],
            'emergency_contacts.*.name' => ['nullable','string','max:150'],
            'emergency_contacts.*.relationship' => ['nullable','string','max:100'],
            'emergency_contacts.*.phone' => ['nullable','string','max:30'],
            'emergency_contacts.*.address' => ['nullable','string','max:255'],

            // experience (tolerant)
            'experience' => ['nullable','array'],
            'experience.*.previous_employer' => ['nullable','string','max:150'],
            'experience.*.total_years' => ['nullable','numeric'],

            // bank (tolerant)
            'bank_accounts' => ['nullable','array'],
            'bank_accounts.*.bank_name' => ['nullable','string','max:150'],
            'bank_accounts.*.bank_account_number' => ['nullable','string','max:50'],
            'bank_accounts.*.bank_branch_name' => ['nullable','string','max:150'],

            // comp
            'compensation' => ['nullable','array'],
            'compensation.salary_currency' => ['nullable','string','size:3'],
            'compensation.pay_frequency' => ['nullable','string','max:10'],
            'compensation.effective_from' => ['nullable','date'],
            'compensation.effective_to' => ['nullable','date','after_or_equal:compensation.effective_from'],
            'compensation.components' => ['nullable','array'],
            'compensation.components.*.component_type' => ['nullable','string','max:10'],
            'compensation.components.*.component_name' => ['nullable','string','max:120'],
            'compensation.components.*.amount' => ['nullable','numeric'],

            // yearly leave
            'yearly_leave' => ['nullable','array'],
            'yearly_leave.*.leave_policy_id' => ['required','integer','exists:leave_policies,leave_policy_id'],
            'yearly_leave.*.leave_entitlement' => ['required','integer'],

            // docs
            'employee_documents' => ['nullable','array'],
            'employee_documents.*.doc_type' => ['required','string','max:30'],
            'employee_documents.*.files' => ['nullable','array'],
            'employee_documents.*.files.*' => ['file','max:10240'],

        ]);

        DB::transaction(function () use ($employee, $validated) {

            $employee->update([
                'employment_status' => $validated['employment_status'],
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
                'last_updated_by' => auth()->id(),
                'last_updated_date' => now(),
            ]);

            // job
            EmployeeJob::updateOrCreate(
                ['employee_id' => $employee->employee_id],
                [
                    'department_id' => $validated['department_id'],
                    'job_title_id' => $validated['job_title_id'],
                    'employment_type' => $validated['employment_type'],
                    'employment_level' => $validated['employment_level'],
                    'date_of_joining' => $validated['date_of_joining'],
                    'probation_end_date' => $validated['probation_end_date'] ?? null,
                    'reporting_manager_id' => $validated['reporting_manager_id'] ?? null,
                ]
            );

            // contacts replace
            EmployeeContact::where('employee_id', $employee->employee_id)->delete();
            foreach ($validated['contacts'] as $c) {
                EmployeeContact::create([
                    'employee_id' => $employee->employee_id,
                    'contact_type' => $c['contact_type'],
                    'contact_value' => $c['contact_value'],
                    'is_primary' => (bool)($c['is_primary'] ?? false),
                ]);
            }

            // addresses replace
            EmployeeAddress::where('employee_id', $employee->employee_id)->delete();
            foreach ($validated['addresses'] as $a) {
                EmployeeAddress::create([
                    'employee_id' => $employee->employee_id,
                    'address_type' => $a['address_type'],
                    'address_line_1' => $a['address_line_1'],
                    'city' => $a['city'],
                    'country' => $a['country'],
                    'postal_code' => $a['postal_code'],
                    'is_current' => (bool)($a['is_current'] ?? false),
                ]);
            }

            // emergency replace (skip empty)
            EmployeeEmergencyContact::where('employee_id', $employee->employee_id)->delete();
            foreach (($validated['emergency_contacts'] ?? []) as $ec) {
                if (empty($ec['name']) && empty($ec['phone']) && empty($ec['relationship']) && empty($ec['address'])) continue;
                EmployeeEmergencyContact::create([
                    'employee_id' => $employee->employee_id,
                    'name' => $ec['name'] ?? '',
                    'relationship' => $ec['relationship'] ?? '',
                    'phone' => $ec['phone'] ?? '',
                ]);
            }

            // experience replace (skip empty)
            EmployeeExperience::where('employee_id', $employee->employee_id)->delete();
            foreach (($validated['experience'] ?? []) as $ex) {
                if (empty($ex['previous_employer']) && empty($ex['total_years'])) continue;
                EmployeeExperience::create([
                    'employee_id' => $employee->employee_id,
                    'previous_employer' => $ex['previous_employer'] ?? '',
                    'total_years' => $ex['total_years'] ?? null,
                ]);
            }

            // bank replace (skip empty)
            EmployeeBankAccount::where('employee_id', $employee->employee_id)->delete();
            foreach (($validated['bank_accounts'] ?? []) as $b) {
                if (empty($b['bank_name']) && empty($b['bank_account_number']) && empty($b['bank_branch_name'])) continue;
                EmployeeBankAccount::create([
                    'employee_id' => $employee->employee_id,
                    'bank_name' => $b['bank_name'] ?? '',
                    'bank_account_number' => $b['bank_account_number'] ?? '',
                    'bank_branch_name' => $b['bank_branch_name'] ?? null,
                ]);
            }

            // yearly leave upsert
            $rows = collect($validated['yearly_leave'] ?? [])
                ->filter(fn ($yl) => !empty($yl['leave_policy_id']))
                ->map(fn ($yl) => [
                    'employee_id' => $employee->employee_id,
                    'leave_policy_id' => (int) $yl['leave_policy_id'],
                    'leave_entitlement' => (int) ($yl['leave_entitlement'] ?? 0),
                ])
                ->values()
                ->all();

            if (!empty($rows)) {
                DB::table('employee_yearly_leave_balance')->upsert(
                    $rows,
                    ['employee_id', 'leave_policy_id'],   // conflict columns (matches your PK)
                    ['leave_entitlement']                 // columns to update
                );
            }

            $policyIds = array_column($rows, 'leave_policy_id');

            DB::table('employee_yearly_leave_balance')
                ->where('employee_id', $employee->employee_id)
                ->whereNotIn('leave_policy_id', $policyIds)
                ->delete();

            Log::info('YEARLY LEAVE saved count', [
                'count' => EmployeeYearlyLeaveBalance::where('employee_id', $employee->employee_id)->count()
                ]);


            // compensation latest + components
            if (!empty($validated['compensation'] ?? null)) {
                $comp = $validated['compensation'];

                $existing = EmployeeCompensation::where('employee_id', $employee->employee_id)
                    ->latest('comp_id')
                    ->first();

                $compensation = $existing
                    ? tap($existing)->update([
                        'salary_currency' => $comp['salary_currency'] ?? 'LKR',
                        'pay_frequency' => $comp['pay_frequency'] ?? 'Monthly',
                        'effective_from' => $comp['effective_from'] ?? null,
                        'effective_to' => $comp['effective_to'] ?? null,
                    ])
                    : EmployeeCompensation::create([
                        'employee_id' => $employee->employee_id,
                        'salary_currency' => $comp['salary_currency'] ?? 'LKR',
                        'pay_frequency' => $comp['pay_frequency'] ?? 'Monthly',
                        'effective_from' => $comp['effective_from'] ?? null,
                        'effective_to' => $comp['effective_to'] ?? null,
                    ]);

                EmployeeCompensationComponent::where('comp_id', $compensation->comp_id)->delete();

                foreach (($comp['components'] ?? []) as $cc) {
                    if (empty($cc['component_name']) || !isset($cc['amount']) || $cc['amount'] === '') continue;
                    EmployeeCompensationComponent::create([
                        'comp_id' => $compensation->comp_id,
                        'component_type' => $cc['component_type'] ?? 'Allowance',
                        'component_name' => $cc['component_name'],
                        'amount' => $cc['amount'],
                    ]);
                }
            }

            // docs append only
            foreach (($validated['employee_documents'] ?? []) as $doc) {
                $files = $doc['files'] ?? [];

                // ✅ Skip doc row if no files selected
                if (count($files) === 0) continue;

                foreach ($files as $file) {
                    $path = $file->store("employees/{$employee->employee_id}/documents", 'public');

                    Log::info('DOC SAVE', [
                    'doc_type' => $doc['doc_type'] ?? null,
                    'file_class' => is_object($file) ? get_class($file) : gettype($file),
                    'original' => is_object($file) ? $file->getClientOriginalName() : null,
                    'path' => $path ?? null,
                    ]);


                    EmployeeDocument::create([
                        'employee_id' => $employee->employee_id,
                        'doc_type' => $doc['doc_type'],
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'mime_type' => $file->getClientMimeType(),
                        'file_size_bytes' => $file->getSize(),
                        'uploaded_at' => now(),
                    ]);
                }
            }


        });

        return redirect()
            ->route('hrms.employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        DB::transaction(function () use ($employee) {
        if (auth()->user()?->name !== 'Admin') {
            abort(403, 'Unauthorized');
        }

            $employee->delete();
        });

        return redirect()->back()->with('success', 'Employee removed successfully.');
    }

    public function empDashboard()
    {
        $today = Carbon::today();

        // Active employees base query
        $activeEmployeesQ = Employee::query()->where('employment_status', 'Active');

        // ===== Birthdays (today + next 7 days) =====
        $birthdaysAll = (clone $activeEmployeesQ)
            ->whereNotNull('date_of_birth')
            ->get(['employee_id','first_name','last_name','employee_code','date_of_birth'])
            ->map(function ($e) use ($today) {
                $dob  = Carbon::parse($e->date_of_birth);
                $next = $dob->copy()->year($today->year);
                if ($next->lt($today)) $next->addYear();

                return [
                    'employee_id'   => $e->employee_id,
                    'employee_code' => $e->employee_code,
                    'name'          => trim(($e->first_name ?? '').' '.($e->last_name ?? '')),
                    'date_of_birth' => $dob->toDateString(),
                    'next_birthday' => $next->toDateString(),
                    'days_left'     => $today->diffInDays($next),
                ];
            });

        $todayBirthdays = $birthdaysAll->where('days_left', 0)->values();
        $upcomingBirthdays = $birthdaysAll->filter(fn ($x) => $x['days_left'] >= 1 && $x['days_left'] <= 7)
            ->sortBy('days_left')->values();

        // Helper to build name/code array from joins
        $mapEmp = fn ($row) => [
            'employee_id'   => $row->employee_id,
            'employee_code' => $row->employee_code,
            'name'          => trim(($row->first_name ?? '').' '.($row->last_name ?? '')),
        ];

        // ===== Probation ending (next 14 days) from employee_job =====
        $probationEnding = EmployeeJob::query()
            ->join('employees', 'employees.employee_id', '=', 'employee_job.employee_id')
            ->where('employees.employment_status', 'Active')
            ->whereNotNull('employee_job.probation_end_date')
            ->whereBetween('employee_job.probation_end_date', [
                $today->toDateString(),
                $today->copy()->addDays(14)->toDateString(),
            ])
            ->orderBy('employee_job.probation_end_date')
            ->get([
                'employee_job.employee_id',
                'employee_job.probation_end_date',
                'employees.employee_code',
                'employees.first_name',
                'employees.last_name',
            ])
            ->map(function ($row) use ($today, $mapEmp) {
                $end = Carbon::parse($row->probation_end_date);
                return $mapEmp($row) + [
                    'probation_end_date' => $end->toDateString(),
                    'days_left' => $today->diffInDays($end, false),
                ];
            })
            ->values();

        // ===== Recent hires (last 30 days) from employee_job =====
        $recentHires = EmployeeJob::query()
            ->join('employees', 'employees.employee_id', '=', 'employee_job.employee_id')
            ->where('employees.employment_status', 'Active')
            ->whereNotNull('employee_job.date_of_joining')
            ->whereBetween('employee_job.date_of_joining', [
                $today->copy()->subDays(30)->toDateString(),
                $today->toDateString(),
            ])
            ->orderByDesc('employee_job.date_of_joining')
            ->limit(8)
            ->get([
                'employee_job.employee_id',
                'employee_job.date_of_joining',
                'employees.employee_code',
                'employees.first_name',
                'employees.last_name',
            ])
            ->map(fn ($row) => $mapEmp($row) + [
                'date_of_joining' => Carbon::parse($row->date_of_joining)->toDateString(),
            ])
            ->values();

        // ===== Department mix =====
        $departmentBreakdown = EmployeeJob::query()
            ->join('employees', 'employees.employee_id', '=', 'employee_job.employee_id')
            ->join('departments', 'departments.department_id', '=', 'employee_job.department_id')
            ->where('employees.employment_status', 'Active')
            ->groupBy('departments.name')
            ->orderByDesc(DB::raw('COUNT(*)'))
            ->limit(8)
            ->get([
                'departments.name as name',
                DB::raw('COUNT(*) as count'),
            ])
            ->map(fn ($r) => ['name' => $r->name, 'count' => (int) $r->count])
            ->values();

        // ===== Stats =====
        $employeesCount = (clone $activeEmployeesQ)->count();
        $missingDobCount = (clone $activeEmployeesQ)->whereNull('date_of_birth')->count();

        return Inertia::render('HRMS/EmpDashboard', [
            'stats' => [
                'employeesCount' => $employeesCount,
                'missingDobCount' => $missingDobCount,
                'newHiresLast30Days' => $recentHires->count(),
                'departmentsCount' => $departmentBreakdown->count(),
            ],
            'todayBirthdays' => $todayBirthdays,
            'upcomingBirthdays' => $upcomingBirthdays,
            'probationEnding' => $probationEnding,
            'recentHires' => $recentHires,
            'departmentBreakdown' => $departmentBreakdown,
        ]);
    }

}