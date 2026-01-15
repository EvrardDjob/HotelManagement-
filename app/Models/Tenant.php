<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;

class Tenant extends Model
{
    use HasFactory;
    protected $primaryKey = 'tenant_id';
    protected $fillable = [
        'hotel_name',
        'address',
        'contact_number',

    ];

    const UPDATED_AT = NULL;

     public function rooms()
    {
        return $this->hasMany(Room::class, 'tenant_id', 'tenant_id');
    }

    public function guests()
    {
        return $this->hasMany(Guest::class, 'tenant_id', 'tenant_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'tenant_id', 'tenant_id');
    }
}
