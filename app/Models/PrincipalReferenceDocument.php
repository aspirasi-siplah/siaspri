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

    public static function generateReferenceId(): string
    {
        do {
            $referenceId = 'ASPRI-BP-'.str_pad(
                (string) random_int(0, 99999),
                5,
                '0',
                STR_PAD_LEFT
            );
        } while (self::where('reference_id', $referenceId)->exists());

        return $referenceId;
    }
}
