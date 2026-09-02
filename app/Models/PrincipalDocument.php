<?php

namespace App\Models;

use App\Enums\PrincipalDocumentType;
use App\Models\Concerns\LogsModelActivity;
use Database\Factories\PrincipalDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrincipalDocument extends Model
{
    /** @use HasFactory<PrincipalDocumentFactory> */
    use HasFactory, LogsModelActivity;

    protected $fillable = ['principal_id', 'name', 'path'];

    protected function casts(): array
    {
        return ['name' => PrincipalDocumentType::class];
    }

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }
}
