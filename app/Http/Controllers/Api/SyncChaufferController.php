<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chauffer;
use Illuminate\Http\Request;

class SyncChaufferController extends Controller
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
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        Chauffer::updateOrCreate(
            ['phone_number' => $data['phone_number']],
            $data
        );

        return response()->json(['ok' => true]);
    }

    public function update(Request $request, string $phone)
    {
        $this->authKey($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $c = Chauffer::where('phone_number', $phone)->firstOrFail();
        $c->update($data);

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, string $phone)
    {
        $this->authKey($request);

        Chauffer::where('phone_number', $phone)->delete();

        return response()->json(['ok' => true]);
    }
}