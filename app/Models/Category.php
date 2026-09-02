<?php

namespace App\Models;

use App\Models\Concerns\LogsModelActivity;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use LogsModelActivity;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function news()
    {
        return $this->belongsToMany(
            News::class,
            'news_categories'
        );
    }
}
