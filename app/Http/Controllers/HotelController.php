<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Tenant::orderBy('created_at', 'desc')->get();
        return Inertia::render('hotels', [
            'hotels' => $hotels
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'hotel_name' =>'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:25',
        ]);

        $hotel = Tenant::create($data);
        return redirect()->route('hotels.index');
    }

    public function update(Request $request, $id)
    {
        $hotel = Tenant::findOrFail($id);
        $data = $request->validate([
            'hotel_name' =>'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
        ]);

        $hotel->update($data);
        return redirect()->route('hotels.index');
    }
}
