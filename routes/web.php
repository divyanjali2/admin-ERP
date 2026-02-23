<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\JobTitleController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\VehicleRequestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/services', fn () => Inertia::render('Services'))->name('services');

    Route::get('/dashboard', function () {
        return redirect()->route('services');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | HRMS Module
    |--------------------------------------------------------------------------
    */

    Route::prefix('hrms')->name('hrms.')->group(function () {

        Route::get('/', fn () => Inertia::render('HRMS'))->name('index');

        Route::get('/emp-dashboard', fn () => Inertia::render('HRMS/EmpDashboard'))->name('emp-dashboard');
        Route::get('/leave-dashboard', [LeaveRequestController::class, 'dashboard'])->name('leave-dashboard');
        Route::get('/vehicle-request-dashboard', [VehicleRequestController::class, 'dashboard'])->name('vehicle-request-dashboard');
        Route::get('/payroll-dashboard', fn () => Inertia::render('HRMS/PayrollDashboard'))->name('payroll-dashboard');
        Route::get('/recruitment-dashboard', fn () => Inertia::render('HRMS/RecruitmentDashboard'))->name('recruitment-dashboard');
        Route::get('/training-dashboard', fn () => Inertia::render('HRMS/TrainingDashboard'))->name('training-dashboard');
        Route::get('/users-management', fn () => Inertia::render('HRMS/UsersManagement'))->name('users-management');

        /*
        |--------------------------------------------------------------------------
        | Resources
        |--------------------------------------------------------------------------
        */

        Route::resource('departments', DepartmentController::class);
        Route::resource('job-titles', JobTitleController::class);
        Route::resource('employees', EmployeeController::class);
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);

        Route::get('leave-balances/{employeeId}', 
            [LeaveRequestController::class, 'getEmployeeLeaveBalances']
        )->name('leave-balances.show');
    });

});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';