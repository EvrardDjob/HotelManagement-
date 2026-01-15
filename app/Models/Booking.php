<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Guest, App\Models\Tenant, App\Models\Room;

class Booking extends Model
{
    use HasFactory;
    protected $primaryKey = 'booking_id';
    protected $fillable = [
        'tenant_id',
        'guest_id',
        'room_id',
        'check_in_date',
        'check_out_date',

    ];

    const UPDATED_AT = NULL;

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'tenant_id');
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guest_id', 'guest_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'room_id');
    }
}
