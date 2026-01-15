<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignManagerController extends Controller
{
    public function index()
    {
        // Get all managers
        $managers = User::where('role', 'manager')->get();

        // Get all hotets
        $hotels = Tenant::all();

        // Prepare manager assignments
        $managerAssignments = $managers->map(function($manager) use($hotels){
            $hotel = $manager->tenant_id ? $hotels->firstWhere('tenant_id', $manager->tenant_id): null;
            return [
                'id' => $manager->id,
                'name' => $manager->name,
                'is_active' => $manager->is_active,
                'hotel' => $hotel ? [
                    'tenant_id' => $hotel->tenant_id,
                    'hotel_name' => $hotel->hotel_name
                ] : null,
            ];
        });

        // Prepare hotel assignements
        $hotelAssignments = $hotels->map(function($hotel) use($managers){
            $manager = $managers->firstWhere('tenant_id', $hotel->tenant_id);
            return [
                'tenant_id' => $hotel->tenant_id,
                'hotel_name' => $hotel->hotel_name,
                'manager' => $manager ? [
                    'id' => $manager->id,
                    'name' => $manager->name,
                    'email' => $manager->email,
                ] : null,
            ];
        });

        return Inertia::render('assign-manager', [
            'managers' => $managerAssignments,
            'hotels' => $hotelAssignments,
        ]);
    }

    public function assign(Request $request, $managerId)
    {
        $request->validate([
            'tenant_id' => 'required|exists:tenants,tenant_id',
        ]);

        $manager = User::where('id', $managerId)
                   ->where('role', 'manager')
                   ->firstOrFail();
        $manager->tenant_id = $request->tenant_id;
        $manager->save();

        return redirect()->route('assign-manager');
    }

    public function unassign($managerId)
    {
        $manager = User::where('id', $managerId)
                   ->where('role', 'manager')
                   ->firstOrFail();
        $manager->tenant_id = null;
        $manager->save();

        return redirect()->route('assign-manager');
    }

    public function toggleActive($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();
        return back()->with('success', 'User status updated');
    }
}
