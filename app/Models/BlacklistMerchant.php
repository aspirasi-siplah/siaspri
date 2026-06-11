<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class BlacklistMerchant extends Model
{
    protected $fillable = [
        'merchant_name',
        'image',
        'reason',
    ];

    public function getImageAttribute($value)
    {
        return $value ? Storage::url($value) : null;
    }
}
