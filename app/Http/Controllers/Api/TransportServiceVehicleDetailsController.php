<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransportService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TransportServiceVehicleDetailsController extends Controller
{
    public function show(string $id)
    {
        if (!ctype_digit($id)) {
            return response()->json(['error' => 'invalid_request'], 400);
        }

        $ts = TransportService::query()
            ->select(['id', 'vehicle_no'])
            ->find($id);

        if (!$ts) {
            return response()->json(['error' => 'transport_service_not_found'], 404);
        }

        $vehicleNo = trim((string) $ts->vehicle_no);
        if ($vehicleNo === '') {
            return response()->json(['error' => 'vehicle_no_missing'], 404);
        }

        $cacheKey = 'drive_vehicle:' . $vehicleNo;

        $veh = Cache::get($cacheKey);

        if (!$veh) {
            $base  = rtrim((string) config('services.exploredrive.base_url'), '/');
            $token = trim((string) config('services.exploredrive.token'));

            $resp = Http::acceptJson()
                ->connectTimeout(3)
                ->timeout(8)
                ->when($token !== '', fn ($req) => $req->withHeaders(['X-ERP-KEY' => $token]))
                ->get($base . '/api/vehicles/by-reg-no', [
                    'reg_no' => $vehicleNo,
                ]);

            if ($resp->successful()) {
                $veh = $resp->json();
                Cache::put($cacheKey, $veh, now()->addMinutes(30)); 
            } else {
                return response()->json([
                    'error'        => 'drive_api_failed',
                    'vehicle_no'   => $vehicleNo,
                    'drive_status' => $resp->status(),
                    'drive_body'   => $resp->json(),
                ], $resp->status() === 404 ? 404 : 502);
            }
        }

        if (!is_array($veh) || !isset($veh['make'], $veh['model'])) {
            return response()->json([
                'error'      => 'drive_payload_invalid',
                'vehicle_no' => $vehicleNo,
                'payload'    => $veh,
            ], 502);
        }

        return response()->json([
            'transport_service_id' => (int) $ts->id,
            'vehicle_no' => $vehicleNo,
            'make' => $veh['make'],
            'model' => $veh['model'],
        ]);
    }
}