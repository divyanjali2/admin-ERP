<?php

namespace App\Http\Controllers;

use App\Models\TransportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class VehicleRequestController extends Controller
{
    public function dashboard(Request $request)
    {
        $today = Carbon::today();
        $vehicleNo = $request->get('vehicle_no');

        $format = function ($ts) {
            $start = $ts->assigned_start_at ? Carbon::parse($ts->assigned_start_at) : null;
            $end   = $ts->assigned_end_at ? Carbon::parse($ts->assigned_end_at) : null;

            return [
                // keep same key used by React
                'vehicle_request_id' => $ts->id,

                // NEW: show type
                'type' => $ts->type,

                'chauffer_name' => $ts->chauffer_name,

                'passenger_count' => $ts->passenger_count,

                // vehicle number (from relation or stored string)
                'vehicle_no' => $ts->vehicle_no,

                // employee display (if you have employee relation; else show id or blank)
                'employee_name' => $ts->employee?->full_name
                    ?? $ts->employee?->name
                    ?? ($ts->employee_id ? ('Employee #' . $ts->employee_id) : ''),

                'employee_id' => $ts->employee_id,
                'manager_id' => $ts->manager_id,

                // map assigned dates to what UI expects
                'start_date' => $start?->toDateString(),
                'end_date' => $end?->toDateString(),
                'is_one_day' => $start ? (!$end || $start->toDateString() === $end->toDateString()) : true,

                // map existing fields to UI names
                'reason' => $ts->note,
                'destinations' => $ts->dropoff_location,
                'trip_code' => $ts->trip_code,

                'status' => $ts->status,              // PENDING/APPROVED/REJECTED/CANCELLED
                'reject_reason' => $ts->reject_reason,

                'created_at' => optional($ts->created_at)->toDateString(),

                // you don’t have tripDetails here, keep null
                'trip_details' => null,
            ];
        };

        $base = TransportService::query();
            // ->with(['employee']);

        // OUT TODAY = approved + start today
        $vehiclesToBeOutToday = (clone $base)
            ->where('status', 'APPROVED')
            ->whereDate('assigned_start_at', $today)
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        $pendingRequests = (clone $base)
            ->where('status', 'PENDING')
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        $approvedRequests = (clone $base)
            ->where('status', 'APPROVED')
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        $rejectedRequests = (clone $base)
            ->where('status', 'REJECTED')
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        // SEARCH (by reg no)
        $currentTrips = collect();
        $pastTrips = collect();

        if ($vehicleNo) {
            $searched = (clone $base)
                // ->whereHas('vehicle', fn ($q) => $q->where('reg_no', 'LIKE', "%{$vehicleNo}%"))
                ->orWhere('vehicle_no', 'LIKE', "%{$vehicleNo}%") // if you also store vehicle_no string
                ->orderByDesc('assigned_start_at')
                ->get()
                ->map($format);

            $currentTrips = $searched
                ->filter(fn ($x) => $x['start_date'] && Carbon::parse($x['start_date'])->gte($today))
                ->values();

            $pastTrips = $searched
                ->filter(fn ($x) => $x['start_date'] && Carbon::parse($x['start_date'])->lt($today))
                ->values();
        }

        // stats
        $totalRequests = TransportService::count();
        $approvedCount = TransportService::where('status', 'APPROVED')->count();
        $pendingCount  = TransportService::where('status', 'PENDING')->count();
        $rejectedCount = TransportService::where('status', 'REJECTED')->count();

        return Inertia::render('HRMS/VehicleRequestDashboard', [
            'vehiclesToBeOutToday' => $vehiclesToBeOutToday,
            'pendingRequests' => $pendingRequests,
            'approvedRequests' => $approvedRequests,
            'rejectedRequests' => $rejectedRequests,

            'searchedVehicle' => $vehicleNo,
            'currentTrips' => $currentTrips,
            'pastTrips' => $pastTrips,

            'stats' => [
                'totalRequests' => $totalRequests,
                'approved' => $approvedCount,
                'pending' => $pendingCount,
                'rejected' => $rejectedCount,
                'vehiclesToBeOutToday' => $vehiclesToBeOutToday->count(),
            ],
        ]);
    }
}