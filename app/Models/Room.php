<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $primaryKey = 'room_id';
    protected $fillable = [
        'tenant_id',
        'room_number',
        'type',
        'price_per_night',
        'status',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const UPDATED_AT = NULL;

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'tenant_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'room_id', 'room_id');
    }

}
