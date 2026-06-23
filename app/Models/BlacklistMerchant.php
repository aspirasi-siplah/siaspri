<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class BlacklistMerchant extends Model
{
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';

    protected $fillable = [
        'merchant_name',
        'image',
        'reason',
    ];

    public function image(): Attribute {
        return Attribute::make(
            get: fn (string $value) => $value ? Storage::url($value) : null
        );
    }
}
