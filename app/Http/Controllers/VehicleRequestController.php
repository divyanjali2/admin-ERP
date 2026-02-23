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

            $latestTrip = $ts->tripDetails
                ?->sortByDesc('trip_start_datetime')
                ->values()
                ->first();

            return [
                'vehicle_request_id' => $ts->id,
                'type' => $ts->type,
                'passenger_count' => $ts->passenger_count,
                'vehicle_no' => $ts->vehicle_no,
                'employee_name' => $ts->employee?->full_name
                    ?? $ts->employee?->name
                    ?? ($ts->employee_id ? ('Employee #' . $ts->employee_id) : ''),

                'employee_id' => $ts->employee_id,
                'manager_id' => $ts->manager_id,

                // Chauffer (for fallback in React)
                'chauffer_name' => $ts->chauffer_name,
                'chauffer_phone' => $ts->chauffer_phone ?? null,

                // Dates for UI
                'start_date' => $start?->toDateString(),
                'end_date' => $end?->toDateString(),
                'is_one_day' => $start ? (!$end || $start->toDateString() === $end->toDateString()) : true,

                // UI mapping
                'reason' => $ts->note,
                'destinations' => $ts->dropoff_location,
                'trip_code' => $ts->trip_code,

                // Status
                'status' => $ts->status,
                'reject_reason' => $ts->reject_reason,

                'created_at' => optional($ts->created_at)->toDateString(),

                // ✅ Odometer modal data (latest trip)
                'trip_details' => $latestTrip ? [
                    'trip_detail_id' => $latestTrip->trip_detail_id,
                    'trip_start_datetime' => optional($latestTrip->trip_start_datetime)->toDateTimeString(),
                    'trip_end_datetime' => optional($latestTrip->trip_end_datetime)->toDateTimeString(),
                    'trip_start_odometer' => $latestTrip->trip_start_odometer,
                    'trip_end_odometer' => $latestTrip->trip_end_odometer,
                    'trip_start_odometer_photo' => $latestTrip->trip_start_odometer_photo,
                    'trip_end_odometer_photo' => $latestTrip->trip_end_odometer_photo,
                    'start_trip_fuel' => $latestTrip->start_trip_fuel,
                    'end_trip_fuel' => $latestTrip->end_trip_fuel,
                ] : null,
            ];
        };

        // Base query (eager load tripDetails; add employee only if you actually have it)
        $base = TransportService::with(['tripDetails']); // add 'employee' if exists: ->with(['tripDetails','employee'])

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

        // SEARCH (vehicle_no string)
        $currentTrips = collect();
        $pastTrips = collect();

        if ($vehicleNo) {
            $searched = (clone $base)
                ->where('vehicle_no', 'LIKE', "%{$vehicleNo}%")
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

        // Stats
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