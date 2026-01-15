<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if($user->role === 'admin'){
            $hotels = Tenant::with('rooms')->get();
            $totalHotels = $hotels->count();
            $totalRooms = Room::count();
            $totalManagers = User::where('role', 'manager')->count();
            $totalGuests = Guest::count();

            return \Inertia\Inertia::render('dashboard', [
                'isAdmin' => true,
                'hotels' => $hotels,
                'totalHotels' => $totalHotels,
                'totalManagers' => $totalManagers,
                'totalGuests' => $totalGuests,
            ]);
        }

        $tenantId = $user->tenant_id;
        $hotel = Tenant::where('tenant_id', $tenantId)->first();
        $guestsCount = Guest::where('tenant_id', $tenantId)->count();
        $roomsCount = Room::where('tenant_id', $tenantId)->count();
        $bookingsCount = Booking::where('tenant_id', $tenantId)->count();

        return \Inertia\Inertia::render('dashboard', [
            'isAdmin' => false,
            'hotel' => $hotel,
            'guestsCount' => $guestsCount,
            'roomsCount' => $roomsCount,
            'bookingsCount' => $bookingsCount,
        ]);
    }
}
