<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class NewsDocuments extends Model
{
    protected $fillable = [
        'news_id',
        'name',
        'file_name',
        'file_path',
    ];

    public function news()
    {
        return $this->belongsTo(News::class);
    }

    public function filePath(): Attribute
    {
        return Attribute::make(
            get: fn(string $value) => $value ? Storage::url($value) : null
        );
    }
}
