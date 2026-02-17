<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\EmployeeYearlyLeaveBalance;
use App\Models\EmployeeLeaveBalance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveRequestController extends Controller
{
    public function dashboard(Request $request)
    {
        $today = Carbon::today()->toDateString();

        $onLeave = LeaveRequest::with(['employee.job.department','policy','overseeMember'])
            ->where('status', 'Approved')
            ->whereDate('leave_start_date', '<=', $today)
            ->whereDate('leave_end_date', '>=', $today)
            ->get();

        $pending = LeaveRequest::with(['employee','policy','overseeMember'])
            ->where('status', 'Pending')
            ->orderByDesc('requested_at')
            ->get();

        $approvedCount = LeaveRequest::where('status', 'Approved')->count();
        $rejectedCount = LeaveRequest::where('status', 'Rejected')->count();
        $pendingCount = $pending->count();

        $employeesOnLeave = $onLeave->map(function ($lr) {
            $balance = EmployeeYearlyLeaveBalance::where('employee_id', $lr->employee_id)
                ->where('leave_policy_id', $lr->leave_policy_id)
                ->first();

            return [
                'name' => trim(($lr->employee->first_name ?? '') . ' ' . ($lr->employee->last_name ?? '')),
                'type' => $lr->policy?->name ?? null,
                'department' => $lr->employee?->job?->department?->name ?? null,
                'manager' => trim(($lr->overseeMember?->first_name ?? '') . ' ' . ($lr->overseeMember?->last_name ?? '')),
                'leave_request_id' => $lr->leave_request_id,
                'start' => optional($lr->leave_start_date)->toDateString(),
                'end' => optional($lr->leave_end_date)->toDateString(),
                'number_of_days' => $lr->number_of_days,
                'reason' => $lr->reason,
                'balance' => $balance?->leave_entitlement,
                'half_day_session' => $lr->half_day_session,
                'manager_comment' => $lr->manager_comment,
                'reliever_comment' => $lr->reliever_comment,
            ];
        });

        $pendingList = $pending->map(function ($lr) {
            return [
                'name' => trim(($lr->employee->first_name ?? '') . ' ' . ($lr->employee->last_name ?? '')),
                'days' => (string) $lr->number_of_days . ' Day(s)',
                'reason' => (string) $lr->reason . ' Day(s)',
                'department' => $lr->employee?->job?->department?->name ?? null,
                'manager' => trim(($lr->overseeMember?->first_name ?? '') . ' ' . ($lr->overseeMember?->last_name ?? '')),
                'leave_request_id' => $lr->leave_request_id,
                'start' => optional($lr->leave_start_date)->toDateString(),
                'end' => optional($lr->leave_end_date)->toDateString(),
            ];
        });

        $employees = Employee::orderBy('first_name')
            ->select('employee_id', 'employee_code', 'first_name', 'last_name')
            ->get()
            ->map(fn ($e) => [
                'id' => $e->employee_id,
                'name' => trim(($e->first_name ?? '') . ' ' . ($e->last_name ?? '')),
                'code' => $e->employee_code,
            ]);

        $totalEntitlement = EmployeeYearlyLeaveBalance::sum('leave_entitlement');

        return Inertia::render('HRMS/LeaveDashboard', [
            'employeesOnLeave' => $employeesOnLeave,
            'pendingRequests' => $pendingList,
            'employees' => $employees,
            'stats' => [
                'onLeaveToday' => $employeesOnLeave->count(),
                'pendingRequests' => $pendingCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
                'totalEntitlement' => (int) $totalEntitlement,
            ],
        ]);
    }

    public function getEmployeeLeaveBalances($employeeId)
    {
        $balances = EmployeeLeaveBalance::with('policy')
            ->where('employee_id', $employeeId)
            ->get()
            ->map(function ($balance) {
                $yearlyBalance = EmployeeYearlyLeaveBalance::where('employee_id', $balance->employee_id)
                    ->where('leave_policy_id', $balance->leave_policy_id)
                    ->first();

                return [
                    'leave_balance_id' => $balance->leave_balance_id,
                    'policy_name' => $balance->policy?->name ?? 'Unknown',
                    'leave_entitlement' => $yearlyBalance?->leave_entitlement ?? 0,
                    'total_taken' => (float) $balance->total_taken,
                    'remaining' => (float) $balance->remaining,
                ];
            });

        return response()->json([
            'balances' => $balances,
        ]);
    }
}
