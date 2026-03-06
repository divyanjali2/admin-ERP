<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransportService;
use Illuminate\Http\Request;

class SyncTransportServiceController extends Controller
{
    private function authKey(Request $request): void
    {
        $key = $request->header('X-ERP-KEY');
        abort_unless($key && hash_equals(config('services.erp_sync.key'), $key), 401);
    }

    public function store(Request $request)
    {
        $this->authKey($request);

        $data = $request->validate([
            'source_id' => 'required|integer',
            'type' => 'required|in:shuttle,transfers,office,personal',
            'vehicle_no' => 'nullable|string|max:50',
            'employee_id' => 'required|integer', 
            'chauffer_phone' => 'nullable|string|max:20',
            'chauffer_name' => 'nullable|string|max:255',
            'assigned_start_at' => 'required|date',
            'assigned_end_at' => 'nullable|date',
            'pickup_location' => 'nullable|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'passenger_count' => 'required|integer|min:1',
        ]);

        TransportService::updateOrCreate(
            ['source_id' => $data['source_id']],
            $data
        );

        return response()->json(['ok' => true]);
    }

    public function update(Request $request, int $source_id)
    {
        $this->authKey($request);

        $data = $request->validate([
            'type' => 'required|in:shuttle,transfers,office,personal',
            'vehicle_no' => 'nullable|string|max:50',
            'employee_id' => 'required|integer', 
            'chauffer_phone' => 'nullable|string|max:20',
            'chauffer_name' => 'nullable|string|max:255',
            'assigned_start_at' => 'required|date',
            'assigned_end_at' => 'nullable|date',
            'pickup_location' => 'nullable|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'passenger_count' => 'required|integer|min:1',
        ]);

        $ts = TransportService::where('source_id', $source_id)->firstOrFail();
        $ts->update($data);

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, int $source_id)
    {
        $this->authKey($request);

        $ts = TransportService::where('source_id', $source_id)->firstOrFail();
        $ts->delete();

        return response()->json(['ok' => true]);
    }
}