<?php

namespace App\Http\Controllers;

use App\Models\VehicleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class VehicleRequestController extends Controller
{
    public function dashboard(Request $request)
    {
        $today = Carbon::today();
        $vehicleNo = $request->get('vehicle_no'); // search param

        /**
         * Helper: map latest trip detail (or null)
         */
        $mapTripDetails = function ($vr) {
            $latest = $vr->tripDetails
                ?->sortByDesc('trip_start_datetime')
                ->values()
                ->first();

            if (!$latest) return null;

            return [
                'trip_detail_id' => $latest->trip_detail_id,
                'trip_start_datetime' => optional($latest->trip_start_datetime)->toDateTimeString(),
                'trip_end_datetime' => optional($latest->trip_end_datetime)->toDateTimeString(),
                'trip_start_odometer' => $latest->trip_start_odometer,
                'trip_end_odometer' => $latest->trip_end_odometer,
                'trip_start_odometer_photo' => $latest->trip_start_odometer_photo,
                'trip_end_odometer_photo' => $latest->trip_end_odometer_photo,
                'created_at' => optional($latest->created_at)->toDateTimeString(),
                'updated_at' => optional($latest->updated_at)->toDateTimeString(),
            ];
        };

        /**
         * Helper: standard request formatter
         */
        $formatRequest = function ($vr) use ($mapTripDetails) {
            return [
                'vehicle_request_id' => $vr->vehicle_request_id,
                'employee_name' => trim(($vr->employee?->first_name ?? '') . ' ' . ($vr->employee?->last_name ?? '')),
                'employee_id' => $vr->employee_id,
                'vehicle_reg_no' => $vr->vehicle_reg_no,

                // request date range (NOT trip dates)
                'start_date' => optional($vr->start_date)->toDateString(),
                'end_date' => optional($vr->end_date)->toDateString(),
                'is_one_day' => (bool) ($vr->is_one_day ?? false),

                'reason' => $vr->reason,
                'destinations' => $vr->destinations,
                'trip_code' => $vr->trip_code,

                'status' => $vr->status,
                'reject_reason' => $vr->reject_reason,

                'created_at' => optional($vr->created_at)->toDateString(),

                // ✅ trip details for modal
                'trip_details' => $mapTripDetails($vr),
            ];
        };

        /**
         * ----------------------------------------------------
         * ORIGINAL DASHBOARD LISTS (no search applied)
         * ----------------------------------------------------
         */
        $vehiclesToBeOutToday = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'APPROVED')
            ->whereDate('start_date', $today)
            ->orderByDesc('created_at')
            ->get();

        $pendingRequests = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'PENDING')
            ->orderByDesc('created_at')
            ->get();

        $approvedRequests = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'APPROVED')
            ->orderByDesc('created_at')
            ->get();

        $rejectedRequests = VehicleRequest::with(['employee', 'tripDetails'])
            ->where('status', 'REJECTED')
            ->orderByDesc('created_at')
            ->get();

        // Stats (fixed casing)
        $totalRequests = VehicleRequest::count();
        $approvedCount = VehicleRequest::where('status', 'APPROVED')->count();
        $pendingCount  = VehicleRequest::where('status', 'PENDING')->count();
        $rejectedCount = VehicleRequest::where('status', 'REJECTED')->count();

        /**
         * ----------------------------------------------------
         * SEARCH RESULT LISTS (only if vehicle_no exists)
         * ----------------------------------------------------
         */
        $currentTrips = collect();
        $pastTrips = collect();

        if ($vehicleNo) {
            $searched = VehicleRequest::with(['employee', 'tripDetails'])
                ->where('vehicle_reg_no', 'LIKE', "%{$vehicleNo}%")
                ->orderByDesc('start_date')
                ->get();

            $currentTrips = $searched
                ->filter(fn ($vr) => $vr->start_date && Carbon::parse($vr->start_date)->gte($today))
                ->map($formatRequest)
                ->values();

            $pastTrips = $searched
                ->filter(fn ($vr) => $vr->start_date && Carbon::parse($vr->start_date)->lt($today))
                ->map($formatRequest)
                ->values();
        }

        /**
         * ----------------------------------------------------
         * RETURN VIEW
         * ----------------------------------------------------
         */
        return Inertia::render('HRMS/VehicleRequestDashboard', [
            // original dashboard
            'vehiclesToBeOutToday' => $vehiclesToBeOutToday->map($formatRequest)->values(),
            'pendingRequests'      => $pendingRequests->map($formatRequest)->values(),
            'approvedRequests'     => $approvedRequests->map($formatRequest)->values(),
            'rejectedRequests'     => $rejectedRequests->map($formatRequest)->values(),

            // search
            'searchedVehicle' => $vehicleNo,
            'currentTrips' => $currentTrips,
            'pastTrips' => $pastTrips,

            // stats
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
