<?php

namespace App\Http\Controllers;

use App\Models\VehicleRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class VehicleRequestController extends Controller
{
    public function dashboard(Request $request)
    {
        $today = Carbon::today();

        $vehiclesToBeOutToday = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'APPROVED')
            ->whereDate('start_date', $today)
            ->get();

        $pendingRequests = VehicleRequest::with(['employee'])
            ->where('status', 'PENDING')
            ->orderByDesc('created_at')
            ->get();

        $approvedRequests = VehicleRequest::with(['employee'])
            ->where('status', 'APPROVED')
            ->orderByDesc('created_at')
            ->get();

        $rejectedRequests = VehicleRequest::with(['employee'])
            ->where('status', 'REJECTED')
            ->orderByDesc('created_at')
            ->get();

        // Stats
        $totalRequests = VehicleRequest::count();
        $approvedCount = VehicleRequest::where('status', 'Approved')->count();
        $pendingCount = $pendingRequests->count();
        $rejectedCount = VehicleRequest::where('status', 'Rejected')->count();

        // Format vehicles to be out today
        $vehiclesToBeOutTodayFormatted = $vehiclesToBeOutToday->map(function ($vr) {
            return [
                'vehicle_request_id' => $vr->vehicle_request_id,
                'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                'employee_id' => $vr->employee_id,
                'vehicle_reg_no' => $vr->vehicle_reg_no,
                'start_date' => optional($vr->start_date)->toDateString(),
                'end_date' => optional($vr->end_date)->toDateString(),
                'is_one_day' => $vr->is_one_day ?? false,
                'reason' => $vr->reason,
                'destinations' => $vr->destinations,
                'trip_code' => $vr->trip_code,
            ];
        });

        // Format pending requests
        $pendingRequestsFormatted = $pendingRequests->map(function ($vr) {
            return [
                'vehicle_request_id' => $vr->vehicle_request_id,
                'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                'employee_id' => $vr->employee_id,
                'vehicle_reg_no' => $vr->vehicle_reg_no,
                'start_date' => optional($vr->start_date)->toDateString(),
                'end_date' => optional($vr->end_date)->toDateString(),
                'is_one_day' => $vr->is_one_day ?? false,
                'reason' => $vr->reason,
                'destinations' => $vr->destinations,
                'trip_code' => $vr->trip_code,
                'created_at' => optional($vr->created_at)->toDateString(),
            ];
        });

        // Format approved requests
        $approvedRequestsFormatted = $approvedRequests->map(function ($vr) {
            return [
                'vehicle_request_id' => $vr->vehicle_request_id,
                'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                'employee_id' => $vr->employee_id,
                'vehicle_reg_no' => $vr->vehicle_reg_no,
                'start_date' => optional($vr->start_date)->toDateString(),
                'end_date' => optional($vr->end_date)->toDateString(),
                'is_one_day' => $vr->is_one_day ?? false,
                'reason' => $vr->reason,
                'destinations' => $vr->destinations,
                'trip_code' => $vr->trip_code,
                'created_at' => optional($vr->created_at)->toDateString(),
            ];
        });

        return Inertia::render('HRMS/VehicleRequestDashboard', [
            'vehiclesToBeOutToday' => $vehiclesToBeOutTodayFormatted,
            'pendingRequests' => $pendingRequestsFormatted,
            'approvedRequests' => $approvedRequestsFormatted,
            'rejectedRequests' => $rejectedRequests->map(function ($vr) {
                return [
                    'vehicle_request_id' => $vr->vehicle_request_id,
                    'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                    'employee_id' => $vr->employee_id,
                    'vehicle_reg_no' => $vr->vehicle_reg_no,
                    'start_date' => optional($vr->start_date)->toDateString(),
                    'end_date' => optional($vr->end_date)->toDateString(),
                    'is_one_day' => $vr->is_one_day ?? false,
                    'reason' => $vr->reason,
                    'destinations' => $vr->destinations,
                    'trip_code' => $vr->trip_code,
                    'created_at' => optional($vr->created_at)->toDateString(),
                ];
            }),
            'stats' => [
                'totalRequests' => $totalRequests,
                'approved' => $approvedCount,
                'pending' => $pendingCount,
                'rejected' => $rejectedCount,
                'vehiclesToBeOutToday' => $vehiclesToBeOutTodayFormatted->count(),
            ],
        ]);
    }
}
