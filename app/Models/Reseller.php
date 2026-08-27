<?php

namespace App\Models;

use Database\Factories\ResellerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reseller extends Model
{
    /** @use HasFactory<ResellerFactory> */
    use HasFactory;

    protected $fillable = ['principal_id', 'name', 'npwp_number', 'document_number', 'document_path', 'reference_code'];

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }
}
