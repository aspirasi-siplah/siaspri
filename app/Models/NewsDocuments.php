<?php

namespace App\Models;

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

    public function getFilePathAttribute($value)
    {
        return $value ? Storage::url($value) : null;
    }
}
