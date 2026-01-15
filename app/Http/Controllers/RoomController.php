<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('rooms/index', [
            'rooms' => Room::where('tenant_id', $user->tenant_id)
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'type' => 'required|string|max:100',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        $validated['tenant_id'] = $user->tenant_id;

        Room::create($validated);

        return Inertia::render('rooms/index', [
            'rooms' => Room::where('tenant_id', $user->tenant_id)
                ->orderBy('created_at', 'desc')
                ->get(),
        ])->with('success', 'Room created successfully.');
    }

    /**
     * Update a room.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $room = Room::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'type' => 'required|string|max:100',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        $room->update($validated);

        return Inertia::render('rooms/index', [
            'rooms' => Room::where('tenant_id', $user->tenant_id)
                ->orderBy('created_at', 'desc')
                ->get(),
        ])->with('success', 'Room updated successfully.');
    }

    /**
     * Delete a room.
     */
    public function destroy($id)
    {
        $user = request()->user();

        $room = Room::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $room->delete();

        return Inertia::render('rooms/index', [
            'rooms' => Room::where('tenant_id', $user->tenant_id)
                ->orderBy('created_at', 'desc')
                ->get(),
        ])->with('success', 'Room deleted successfully.');
    }
}
