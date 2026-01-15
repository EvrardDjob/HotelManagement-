<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('bookings/index', [
            'bookings' => Booking::where('tenant_id', $user->tenant_id)
                ->orderBy('created_at', 'desc')
                ->get(),
            'guests' => Guest::where('tenant_id', $user->tenant_id)->get(),
            'rooms'  => Room::where('tenant_id', $user->tenant_id)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,guest_id',
            'room_id'  => 'required|exists:rooms,room_id',
            'check_in_date'  => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
        ]);

        $room = Room::where('tenant_id', $user->tenant_id)
            ->where('room_id', $validated['room_id'])
            ->where('status', 'available')
            ->first();

        if (!$room) {
            return back()->withErrors([
                'room_id' => 'This room is not available.',
            ]);
        }

        Booking::create([
            ...$validated,
            'tenant_id' => $user->tenant_id,
        ]);

        $room->update(['status' => 'occupied']);

        return $this->index($request)->with('success', 'Booking created.');
    }

    public function update(Request $request, int $id)
    {
        $user = $request->user();

        $booking = Booking::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,guest_id',
            'room_id'  => 'required|exists:rooms,room_id',
            'check_in_date'  => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
        ]);

        if ($booking->room_id !== $validated['room_id']) {
            $newRoom = Room::where('tenant_id', $user->tenant_id)
                ->where('room_id', $validated['room_id'])
                ->where('status', 'available')
                ->first();

            if (!$newRoom) {
                return back()->withErrors([
                    'room_id' => 'Selected room is not available.',
                ]);
            }

            Room::where('room_id', $booking->room_id)
                ->update(['status' => 'available']);

            $newRoom->update(['status' => 'occupied']);
        }

        $booking->update($validated);

        return $this->index($request)->with('success', 'Booking updated.');
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();

        $booking = Booking::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        Room::where('tenant_id', $user->tenant_id)
            ->where('room_id', $booking->room_id)
            ->update(['status' => 'available']);

        $booking->delete();

        return $this->index($request)->with('success', 'Booking deleted.');
    }
}
