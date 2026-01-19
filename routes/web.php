<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\AssignManagerController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('hotels', HotelController::class)->only(['index', 'store', 'update']);
    Route::get('assign-manager', [AssignManagerController::class, 'index'])->name('assign-manager');
    Route::post('assign-manager/{manager}/assign', [AssignManagerController::class, 'assign'])->name('assign-manager.assign');
    Route::post('assign-manager/{manager}/unassign', [AssignManagerController::class, 'unassign'])->name('assign-manager.unassign');
    Route::post('assign-manager/{id}/toggle-active', [AssignManagerController::class, 'toggleActive'])->name('users.toggleActive');

    
    Route::get('user-roles', [UserRoleController::class, 'index'])->name('user-roles.index');
    Route::post('user-roles/{id}/update-role', [UserRoleController::class, 'updateRole'])->name('user-roles.update-role');
    Route::delete('user-roles/{id}', [UserRoleController::class, 'destroy'])->name('user-roles.destroy');

    Route::resource('rooms', RoomController::class)->except(['create','edit']);
    Route::resource('guests', GuestController::class)->except(['create','edit']);
    Route::resource('bookings', BookingController::class)->except(['create','edit']);
});



require __DIR__.'/settings.php';
// require __DIR__. '/auth.php';
