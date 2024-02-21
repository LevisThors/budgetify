<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Transaction extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'type',
        'title',
        'description',
        'amount',
        'payment_date',
        'payee',
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
