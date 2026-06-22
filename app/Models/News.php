<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class News extends Model
{
    const STATUS_DRAFT = 'draft';
    const STATUS_PUBLISHED = 'published';
    const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'title',
        'slug',
        'thumbnail',
        'content',
        'excerpt',
        'created_by',
        'published_at',
        'status',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'status' => 'string',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function documents()
    {
        return $this->hasMany(NewsDocuments::class);
    }

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'news_categories'
        );
    }

    public function getThumbnailAttribute($value)
    {
        return $value ? Storage::url($value) : null;
    }
}