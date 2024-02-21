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
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
