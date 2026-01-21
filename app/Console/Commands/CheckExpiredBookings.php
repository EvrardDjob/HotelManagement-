<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notification;
use App\Models\Room;
use App\Models\Booking;
use Carbon\Carbon;

class CheckExpiredBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-expired-bookings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired bookings and create notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        // Trouver les réservations expirées (check_out_date < aujourd'hui)
        $expiredBookings = Booking::where('check_out_date', '<', $today)
            ->whereHas('room', function($query) {
                $query->where('status', 'occupied');
            })
            ->get();

        foreach ($expiredBookings as $booking) {
            // Créer une notification si elle n'existe pas déjà
            $existingNotification = Notification::where('booking_id', $booking->booking_id)
                ->where('type', 'booking_expired')
                ->first();

            if (!$existingNotification) {
                Notification::create([
                    'tenant_id' => $booking->tenant_id,
                    'type' => 'booking_expired',
                    'title' => 'Booking Expired',
                    'message' => "Room {$booking->room->room_number} booking has expired. Check-out date was {$booking->check_out_date}.",
                    'booking_id' => $booking->booking_id,
                ]);

                $this->info("Notification created for booking #{$booking->booking_id}");
            }
        }

        // Trouver les réservations qui se terminent bientôt (dans 1 jour)
        $tomorrow = Carbon::tomorrow();
        $endingSoonBookings = Booking::whereDate('check_out_date', $tomorrow)
            ->get();

        foreach ($endingSoonBookings as $booking) {
            $existingNotification = Notification::where('booking_id', $booking->booking_id)
                ->where('type', 'booking_ending_soon')
                ->first();

            if (!$existingNotification) {
                Notification::create([
                    'tenant_id' => $booking->tenant_id,
                    'type' => 'booking_ending_soon',
                    'title' => 'Booking Ending Soon',
                    'message' => "Room {$booking->room->room_number} booking ends tomorrow ({$booking->check_out_date}).",
                    'booking_id' => $booking->booking_id,
                ]);

                $this->info("Notification created for upcoming checkout booking #{$booking->booking_id}");
            }
        }

        $this->info('Expired bookings check completed!');
        return Command::SUCCESS;
    }

}
