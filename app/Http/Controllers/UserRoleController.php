<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserRoleController extends Controller
{
    /**
     * Display all users with their roles
     */
    public function index()
    {
        // Get all users except the current user (to avoid changing own role)
        $users = User::where('id', '!=', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_active' => $user->is_active,
                    'tenant_id' => $user->tenant_id,
                    'created_at' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('user-roles/index', [
            'users' => $users,
        ]);
    }

    /**
     * Update user role
     */
    public function updateRole(Request $request, $id)
    {
        // Validation plus stricte
        $validated = $request->validate([
            'role' => 'required|string|in:admin,manager',
        ]);

        // Empêcher de modifier son propre rôle
        if (auth()->id() == $id) {
            return redirect()->back()
                ->withErrors(['role' => 'You cannot modify your own role.']);
        }

        $user = User::findOrFail($id);
        $oldRole = $user->role;
        $newRole = $validated['role'];

        // Ne rien faire si le rôle est déjà le même
        if ($oldRole === $newRole) {
            return redirect()->route('user-roles.index')
                ->with('success', 'User role is already ' . $newRole . '.');
        }

        // Mettre à jour le rôle
        $user->role = $newRole;

        // Si on passe de admin à manager, retirer le tenant_id
        if ($oldRole === 'admin' && $newRole === 'manager') {
            $user->tenant_id = null;
        }

        $user->save();

        //  Déconnecter l'utilisateur pour tous les changements de rôle
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        return redirect()->route('user-roles.index')
            ->with('success', "User role changed from {$oldRole} to {$newRole} successfully.");
    }

    /**
     * Delete a user
     */
    public function destroy($id)
    {
        // Empêcher de se supprimer soi-même
        if (auth()->id() == $id) {
            return redirect()->back()
                ->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user = User::findOrFail($id);

        // Supprimer toutes les sessions
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        $user->delete();

        return redirect()->route('user-roles.index')
            ->with('success', 'User deleted successfully.');
    }
}