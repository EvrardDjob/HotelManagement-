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
                    'created_at' => $notification->created_ad->diffForHumans(),
                ];
            });

        return Inertia::render('notifications/index',[
            'notifications' => $notifications,
        ]);
    }
}
