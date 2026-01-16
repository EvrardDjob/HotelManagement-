<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms for the authenticated user's tenant.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $rooms = Room::where('tenant_id', $user->tenant_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            // 'tenant_id' => $user->tenant_id,
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Validation
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'type' => 'required|string|max:100',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
            
        ]);

        // add tenant_id
        $validated['tenant_id'] = $user->tenant_id;

        // create a room
        Room::create($validated);

        // Redirection with success message
        return redirect()->route('rooms.index')->with('success', 'Room created successfully.');
    }

    /**
     * Display a single room (API ou usage interne).
     */
    public function show($id)
    {
        $user = request()->user();
        
        $room = Room::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        return response()->json($room);
    }

    /**
     * Update an existing room.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        // try to find a room (and check if it's content in that tenant)
        $room = Room::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        // Validation
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'type' => 'required|string|max:100',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        // updating
        $room->update($validated);

        // Redirection with message
        return redirect()->route('rooms.index')->with('success', 'Room updated successfully.');
    }

    /**
     * Remove a room.
     */
    public function destroy($id)
    {
        $user = request()->user();

        // find and remove (check the tenant)
        $room = Room::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $room->delete();

        // Redirection with message
        return redirect()->route('rooms.index')->with('success', 'Room deleted successfully.');
    }
}