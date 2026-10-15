<?php

namespace App\Models;

use App\Models\Concerns\LogsModelActivity;
use Database\Factories\ProgramFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    /** @use HasFactory<ProgramFactory> */
    use HasFactory, LogsModelActivity;

    protected $fillable = ['code', 'name', 'year', 'id_fund'];

    protected $casts = [
        'year' => 'integer',
    ];

    public function principals()
    {
        return $this->hasMany(Principal::class);
    }
}
