<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $guests = Guest::where('tenant_id',  $user->tenant_id)->get();
        return Inertia::render('guests/index', [
            'guests' => $guests,
            // 'tenant_id' => $user->tenant_id,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            // 'check_in_date' => 'nullable|date',
            // 'check_out_date' => 'nullable|date|after_or_equal:check_in_date',
        ]);
        $data['tenant_id'] = $user->tenant_id;
        Guest::create($data);

        return redirect()->route('guests.index')->with('success', 'Guest has been created ');
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();
        $guest = Guest::where('tenant_id', $user->tenant_id)
                      ->findOrFail($id);

        return response()->json($guest);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $guest = Guest::where('tenant_id', $user->tenant_id)
                      ->findOrFail($id);

        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            // 'check_in_date' => 'nullable|date',
            // 'check_out_date' => 'nullable|date|after_or_equal:check_in_date',
        ]);
        $guest->update($data);
        return redirect()->route('guests.index')->with('success', 'Guest has been updated');
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $guest = Guest::where('tenant_id', $user->tenant_id)->findOrFail($id);

        $guest->delete();
        return redirect()->route('guests.index')->with('success', 'Guest has been deleted');
    }
}
