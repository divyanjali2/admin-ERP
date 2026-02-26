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
            $photoBase = rtrim(config('app.url'), '/') . '/mobile-api/';

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
                'start_destinations' => $ts->pickup_location,
                'destinations' => $ts->dropoff_location,
                'trip_code' => $ts->trip_code,

                // Status
                'status' => $ts->status,
                'reject_reason' => $ts->reject_reason,

                'created_at' => optional($ts->created_at)->toDateString(),

                // Odometer modal data (latest trip)
                'trip_details' => $latestTrip ? [
                    'trip_detail_id' => $latestTrip->trip_detail_id,
                    'trip_start_datetime' => optional($latestTrip->trip_start_datetime)->toDateTimeString(),
                    'trip_end_datetime' => optional($latestTrip->trip_end_datetime)->toDateTimeString(),
                    'trip_start_odometer' => $latestTrip->trip_start_odometer,
                    'trip_end_odometer' => $latestTrip->trip_end_odometer,

                    'trip_start_odometer_photo' => $latestTrip->trip_start_odometer_photo
                        ? $photoBase . ltrim($latestTrip->trip_start_odometer_photo, '/')
                        : null,

                    'trip_end_odometer_photo' => $latestTrip->trip_end_odometer_photo
                        ? $photoBase . ltrim($latestTrip->trip_end_odometer_photo, '/')
                        : null,
                    'start_trip_fuel' => $latestTrip->start_trip_fuel,
                    'end_trip_fuel' => $latestTrip->end_trip_fuel,
                                    ] : null,
                                ];
                            };

        // Base query (eager load relations)
        $base = TransportService::with(['tripDetails', 'employee']);

        // OUT TODAY = active statuses + start today
        $vehiclesToBeOutToday = (clone $base)
            ->whereIn('status', ['ASSIGNED', 'START_TRIP', 'IN_PROGRESS'])
            ->whereDate('assigned_start_at', $today)
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        // Buckets by your real statuses
        $assignedRequests = (clone $base)
            ->where('status', 'ASSIGNED')
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        $startTripRequests = (clone $base)
            ->where('status', 'START_TRIP')
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        $inProgressRequests = (clone $base)
            ->where('status', 'IN_PROGRESS')
            ->orderByDesc('assigned_start_at')
            ->get()
            ->map($format)
            ->values();

        $completedRequests = (clone $base)
            ->where('status', 'COMPLETED')
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

        // Stats (your real statuses)
        $totalRequests = TransportService::count();
        $assignedCount = TransportService::where('status', 'ASSIGNED')->count();
        $startTripCount = TransportService::where('status', 'START_TRIP')->count();
        $inProgressCount = TransportService::where('status', 'IN_PROGRESS')->count();
        $completedCount = TransportService::where('status', 'COMPLETED')->count();

        return Inertia::render('HRMS/VehicleRequestDashboard', [
            'vehiclesToBeOutToday' => $vehiclesToBeOutToday,

            'assignedRequests' => $assignedRequests,
            'startTripRequests' => $startTripRequests,
            'inProgressRequests' => $inProgressRequests,
            'completedRequests' => $completedRequests,

            'searchedVehicle' => $vehicleNo,
            'currentTrips' => $currentTrips,
            'pastTrips' => $pastTrips,

            'stats' => [
                'totalRequests' => $totalRequests,
                'assigned' => $assignedCount,
                'startTrip' => $startTripCount,
                'inProgress' => $inProgressCount,
                'completed' => $completedCount,
                'vehiclesToBeOutToday' => $vehiclesToBeOutToday->count(),
            ],
        ]);
    }
}