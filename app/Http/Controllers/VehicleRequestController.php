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

        // Vehicles out now (approved requests where start_date <= today and end_date >= today)
        $vehiclesOutNow = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'Approved')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->get();

        // Vehicles to be out today (approved requests where start_date = today)
        $vehiclesToBeOutToday = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'Approved')
            ->whereDate('start_date', '=', $today)
            ->get();

        // Pending vehicle requests
        $pendingRequests = VehicleRequest::with(['employee'])
            ->where('status', 'Pending')
            ->orderByDesc('created_at')
            ->get();

        // Approved vehicle requests
        $approvedRequests = VehicleRequest::with(['employee'])
            ->where('status', 'Approved')
            ->orderByDesc('created_at')
            ->get();

        // Stats
        $totalRequests = VehicleRequest::count();
        $approvedCount = VehicleRequest::where('status', 'Approved')->count();
        $pendingCount = $pendingRequests->count();
        $rejectedCount = VehicleRequest::where('status', 'Rejected')->count();

        // Format vehicles out now
        $vehiclesOutNowFormatted = $vehiclesOutNow->map(function ($vr) {
            return [
                'vehicle_request_id' => $vr->vehicle_request_id,
                'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                'employee_id' => $vr->employee_id,
                'vehicle_reg_no' => $vr->vehicle_reg_no,
                'start_date' => optional($vr->start_date)->toDateString(),
                'end_date' => optional($vr->end_date)->toDateString(),
                'reason' => $vr->reason,
                'destinations' => $vr->destinations,
                'trip_code' => $vr->trip_code,
                'has_trip_started' => $vr->tripDetails()->whereNotNull('trip_start_datetime')->exists(),
                'trip_detail_id' => $vr->tripDetails()->first()?->trip_detail_id,
            ];
        });

        // Format vehicles to be out today
        $vehiclesToBeOutTodayFormatted = $vehiclesToBeOutToday->map(function ($vr) {
            return [
                'vehicle_request_id' => $vr->vehicle_request_id,
                'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                'employee_id' => $vr->employee_id,
                'vehicle_reg_no' => $vr->vehicle_reg_no,
                'start_date' => optional($vr->start_date)->toDateString(),
                'end_date' => optional($vr->end_date)->toDateString(),
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
                'reason' => $vr->reason,
                'destinations' => $vr->destinations,
                'trip_code' => $vr->trip_code,
                'created_at' => optional($vr->created_at)->toDateString(),
            ];
        });

        return Inertia::render('HRMS/VehicleRequestDashboard', [
            'vehiclesOutNow' => $vehiclesOutNowFormatted,
            'vehiclesToBeOutToday' => $vehiclesToBeOutTodayFormatted,
            'pendingRequests' => $pendingRequestsFormatted,
            'approvedRequests' => $approvedRequestsFormatted,
            'stats' => [
                'totalRequests' => $totalRequests,
                'approved' => $approvedCount,
                'pending' => $pendingCount,
                'rejected' => $rejectedCount,
                'vehiclesOutNow' => $vehiclesOutNowFormatted->count(),
                'vehiclesToBeOutToday' => $vehiclesToBeOutTodayFormatted->count(),
            ],
        ]);
    }
}
