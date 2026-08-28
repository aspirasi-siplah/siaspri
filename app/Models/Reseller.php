<?php

namespace App\Models;

use Database\Factories\ResellerFactory;
use Illuminate\Database\Eloquent\Builder;
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

    public function scopeSearchByName(Builder $query, string $search): void
    {
        $driver = $query->getQuery()->getConnection()->getDriverName();

        $query->where('name', $driver === 'pgsql' ? 'ILIKE' : 'LIKE', '%'.$search.'%');
    }

    public function getReferenceLinkAttribute(): ?string
    {
        if (! $this->reference_code) {
            return null;
        }

        return route('resellers.show', $this->reference_code);
    }

    public static function generateReferenceCode(string $name): string
    {
        $abbreviation = self::nameAbbreviation($name);

        do {
            $referenceCode = 'ASPRI-'.$abbreviation.'-'.str_pad(
                (string) random_int(0, 99999),
                5,
                '0',
                STR_PAD_LEFT
            );
        } while (self::where('reference_code', $referenceCode)->exists());

        return $referenceCode;
    }

    public static function nameAbbreviation(string $name): string
    {
        $words = preg_split('/\s+/', trim($name), -1, PREG_SPLIT_NO_EMPTY);

        $abbreviation = '';

        foreach ($words as $word) {
            $abbreviation .= strtoupper(substr($word, 0, 1));
        }

        return $abbreviation !== '' ? $abbreviation : 'X';
    }
}
