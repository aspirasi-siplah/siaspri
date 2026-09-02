<?php

namespace App\Models;

use App\Models\Concerns\LogsModelActivity;
use Database\Factories\PrincipalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Principal extends Model
{
    /** @use HasFactory<PrincipalFactory> */
    use HasFactory, LogsModelActivity, SoftDeletes;

    protected $fillable = ['name', 'notes', 'npwp_number', 'nib'];

    public function resellers()
    {
        return $this->hasMany(Reseller::class);
    }

    public function documents()
    {
        return $this->hasMany(PrincipalDocument::class);
    }
}
