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
        'first_payment_date',
        'second_payment_date',
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
