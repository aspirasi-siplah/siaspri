<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerImport extends Model
{
    protected $fillable = ['principal_id', 'status', 'result'];

    protected function casts(): array
    {
        return [
            'result' => 'array',
        ];
    }

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }
}
