<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obligatory extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'amount',
        'payment_dates',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
