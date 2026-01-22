<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display all notification for the current tenant
     */

    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = Notification::where('tenant_id', $user->tenant_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($notification){
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'booking_id' => $notification->booking_id,
                    'is_read' => $notification->is_read,
                    // diffForHumans casts the date as a lisible date for a humans ex: 4 minutes ago...
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('notifications/index',[
            'notifications' => $notifications,
        ]);
    }


    /**
     * Delete a notification
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $notification = Notification::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $notification->delete();

        return redirect()->route('notifications.index')
            ->with('success', 'Notification deleted successfully.');
    }


    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = Notification::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $notification->is_read = true;
        $notification->save();

        return redirect()->back();
    }


     /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        Notification::where('tenant_id', $user->tenant_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return redirect()->back()
            ->with('success', 'All notifications marked as read.');
    }

    /**
     * Get unread count (for API/AJAX calls)
     */
    public function getUnreadCount(Request $request)
    {
        $user = $request->user();

        $count = Notification::where('tenant_id', $user->tenant_id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

}
