<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Redirect root to login
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



Route::prefix('hrms')->middleware(['auth'])->group(function () {
    Route::get('/employees', [EmployeeController::class, 'index'])->name('hrms.employees.index');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('hrms.create');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('hrms.employees.store');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('hrms.employees.destroy');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])
    ->name('hrms.show');

});



require __DIR__.'/auth.php';
