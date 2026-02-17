<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\JobTitleController;
use App\Http\Controllers\LeaveRequestController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/services', function () {
    return Inertia::render('Services');
})->middleware(['auth', 'verified'])->name('services');


// Dashboard (protected)
Route::get('/dashboard', function () {
    return redirect()->route('services');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile routes (protected)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/hrms', function () {
    return Inertia::render('HRMS');
})->middleware(['auth', 'verified'])->name('hrms');

Route::get('/admin', function () {
    return Inertia::render('Admin');
})->middleware(['auth', 'verified'])->name('admin');

Route::prefix('hrms')->name('hrms.')->middleware(['auth', 'verified'])->group(function () {

Route::get('/emp-dashboard', function () {
    return Inertia::render('HRMS/EmpDashboard');
})->name('emp-dashboard');

Route::get('/leave-dashboard', [LeaveRequestController::class, 'dashboard'])->name('leave-dashboard');

Route::get('/vehicle-reauest-dashboard', function () {
    return Inertia::render('HRMS/VehicleRequestDashboard');
})->name('vehicle-reauest-dashboard');

Route::get('/payroll-dashboard', function () {
    return Inertia::render('HRMS/PayrollDashboard');
})->name('payroll-dashboard');

Route::get('/recruitment-dashboard', function () {
    return Inertia::render('HRMS/RecruitmentDashboard');
})->name('recruitment-dashboard');

Route::get('/training-dashboard', function () {
    return Inertia::render('HRMS/TrainingDashboard');
})->name('training-dashboard');

Route::resource('departments', DepartmentController::class);
Route::resource('job-titles', JobTitleController::class);
Route::resource('employees', EmployeeController::class);
});

Route::get('/hrms/emp-dashboard', [EmployeeController::class, 'empDashboard'])
  ->middleware(['auth'])
  ->name('emp-dashboard');

Route::prefix('hrms')->name('hrms.')->middleware(['auth'])->group(function () {
    Route::resource('employees', EmployeeController::class);
    Route::get('leave-balances/{employeeId}', [LeaveRequestController::class, 'getEmployeeLeaveBalances'])->name('leave-balances.show');
});

require __DIR__.'/auth.php';
