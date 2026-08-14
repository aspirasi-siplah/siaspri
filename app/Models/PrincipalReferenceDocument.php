<?php

namespace App\Models;

use Database\Factories\PrincipalReferenceDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrincipalReferenceDocument extends Model
{
    /** @use HasFactory<PrincipalReferenceDocumentFactory> */
    use HasFactory;

    const STATUS_ACTIVE = 'active';

    const STATUS_INACTIVE = 'inactive';

    const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'reference_id',
        'principal_name',
        'document_number',
        'program_name',
        'category_name',
        'status',
        'expired_date',
    ];

    protected $casts = [
        'expired_date' => 'date',
    ];

    public function getReferenceLinkAttribute(): string
    {
        return route('reference-documents.verify', $this->reference_id);
    }

    public static function generateReferenceId(string $programName): string
    {
        $abbreviation = self::programNameAbbreviation($programName);

        do {
            $referenceId = 'ASPRI-'.$abbreviation.'-'.str_pad(
                (string) random_int(0, 99999),
                5,
                '0',
                STR_PAD_LEFT
            );
        } while (self::where('reference_id', $referenceId)->exists());

        return $referenceId;
    }

    private static function programNameAbbreviation(string $programName): string
    {
        $words = preg_split('/\s+/', trim($programName), -1, PREG_SPLIT_NO_EMPTY);

        $abbreviation = '';

        foreach ($words as $word) {
            $abbreviation .= strtoupper(substr($word, 0, 1));
        }

        return $abbreviation !== '' ? $abbreviation : 'BP';
    }
}
