<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'balance',
        'currency',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function obligatories()
    {
        return $this->hasMany(Obligatory::class);
    }

    public function piggyBanks()
    {
        return $this->hasMany(PiggyBank::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
