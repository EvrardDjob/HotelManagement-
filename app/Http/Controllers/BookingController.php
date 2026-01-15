<?php

namespace App\Http\Controllers;

use App\Models\Booking; 
use App\Models\Guest; 
use App\Models\Room; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * display all bookings for the tenant of the logged-in user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('tenant_id', $user->tenant_id)
            ->orderBy('created_at', 'desc')
            ->get();
        $guests = Guest::where('tenant_id', $user->tenant_id)->get();
        $rooms = Room::where('tenant_id', $user->tenant_id)->get();

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'guests' => $guests,
            'rooms' => $rooms,
            // 'tenant_id' => $user->tenant_id,
        ]);
    }

    /**
     *  create a new reversation for the tenant
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // validalidation of data
        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,guest_id',
            'room_id' => 'required|exists:rooms,room_id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
        ]);

        // Vérifier que la chambre appartient au bon tenant ET est disponible
        $room = Room::where('tenant_id', $user->tenant_id)
            ->where('room_id', $validated['room_id'])
            ->where('status', 'available')
            ->first();

        if (!$room) {
            return redirect()->back()
                ->withErrors(['room_id' => 'This room is not available or does not exist.'])
                ->withInput();
        }

        // Création de la réservation avec tenant_id
        Booking::create(array_merge($validated, ['tenant_id' => $user->tenant_id]));

        // Mettre à jour le statut de la chambre à "occupied"
        $room->update(['status' => 'occupied']);

        return redirect()->route('bookings.index')->with('success', 'Booking has been created.');
    }

    /**
     * show a specific reservation (JSON)
     */
    public function show(Request $request, int $id)
    {
        $user = $request->user();

        $booking = Booking::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        return response()->json($booking);
    }

    /**
     * update a reservation
     */
    public function update(Request $request, int $id)
    {
        $user = $request->user();

        $booking = Booking::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,guest_id',
            'room_id' => 'required|exists:rooms,room_id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
        ]);

        // Si la chambre a changé, libérer l'ancienne et occuper la nouvelle
        if ($booking->room_id != $validated['room_id']) {
            // Vérifier que la nouvelle chambre est disponible
            $newRoom = Room::where('tenant_id', $user->tenant_id)
                ->where('room_id', $validated['room_id'])
                ->where('status', 'available')
                ->first();

            if (!$newRoom) {
                return redirect()->back()
                    ->withErrors(['room_id' => 'This room is not available.'])
                    ->withInput();
            }

            // Libérer l'ancienne chambre
            Room::where('room_id', $booking->room_id)
                ->update(['status' => 'available']);

            // Occuper la nouvelle chambre
            $newRoom->update(['status' => 'occupied']);
        }

        $booking->update($validated);

        return redirect()->route('bookings.index')
            ->with('success', 'Booking updated successfully.');
    }

    /**
     * delete a reservation
     */
    public function destroy(Request $request, int $id)
    {
        $user = $request->user();

        $booking = Booking::where('tenant_id', $user->tenant_id)
                          ->findOrFail($id);

        $room = Room::where('tenant_id', $user->tenant_id)
        ->where('room_id', $booking->room_id)
        ->first();

        if ($room) {
            $room->update(['status' => 'available']);
        }

        $booking->delete();

        return redirect()->route('bookings.index')->with('success', 'Booking has been deleted.');
    }
}
