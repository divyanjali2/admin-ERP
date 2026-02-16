<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Employee;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()
                ? $request->user()->only(['id', 'name', 'email', 'employee_id', 'role'])
                : null,                
                'department' => function () use ($request) {
                    $user = $request->user();
                    if (!$user || !$user->employee_id) return null;

                    $employee = Employee::with('job.department')
                        ->where('employee_id', $user->employee_id)
                        ->first();

                    return $employee?->job?->department?->name;
                },
            ],
        ]);
    }

}
