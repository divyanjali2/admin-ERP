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

        $veh = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vehicleNo) {
            $base = rtrim(config('services.exploredrive.base_url'), '/');
            $token = config('services.exploredrive.token');

            $req = Http::acceptJson()
                ->timeout(2)
                ->connectTimeout(1);

            if ($token) {
                $req = $req->withToken($token);
            }

            $resp = $req->get($base . '/api/vehicles/by-reg-no', [
                'reg_no' => $vehicleNo,
            ]);

            if ($resp->successful()) {
                return $resp->json(); // reg_no, make, model
            }

            if ($resp->status() === 404) {
                return ['error' => 'vehicle_not_found'];
            }

            return ['error' => 'drive_api_failed', 'status' => $resp->status()];
        });

        if (!is_array($veh) || isset($veh['error'])) {
            $err = $veh['error'] ?? 'drive_api_failed';
            $code = ($err === 'vehicle_not_found') ? 404 : 502;

            return response()->json([
                'error' => $err,
                'vehicle_no' => $vehicleNo,
            ], $code);
        }

        return response()->json([
            'transport_service_id' => (int) $ts->id,
            'vehicle_no' => $vehicleNo,
            'make' => $veh['make'] ?? null,
            'model' => $veh['model'] ?? null,
        ]);
    }
}

