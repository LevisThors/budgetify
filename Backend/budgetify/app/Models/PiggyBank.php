<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PiggyBank extends Model
{
    use HasFactory;

    protected $fillable = [
        'goal',
        'goal_amount',
        'saved_amount',
        'date',
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
