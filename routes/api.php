<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SyncChaufferController;
use App\Http\Controllers\Api\SyncTransportServiceController;
use App\Http\Controllers\Api\TransportServiceVehicleDetailsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/sync/chauffers', [SyncChaufferController::class, 'store']);
Route::put('/sync/chauffers/{phone}', [SyncChaufferController::class, 'update']);
Route::delete('/sync/chauffers/{phone}', [SyncChaufferController::class, 'destroy']);

Route::post('/sync/transport-services', [SyncTransportServiceController::class, 'store']);
Route::put('/sync/transport-services/{source_id}', [SyncTransportServiceController::class, 'update']);
Route::delete('/sync/transport-services/{source_id}', [SyncTransportServiceController::class, 'destroy']);

Route::get('/transport-services/{id}/vehicle-details', [TransportServiceVehicleDetailsController::class, 'show']);