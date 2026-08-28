<?php

namespace App\Enums;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

enum PrincipalDocumentType: string implements Arrayable, JsonSerializable
{
    case STATEMENT_LETTER = 'STATEMENT_LETTER';
    case LETTER_OF_SUPPORT = 'LETTER_OF_SUPPORT';
    case INTEGRITY_PACT = 'INTEGRITY_PACT';

    public function label(): string
    {
        return match ($this) {
            self::STATEMENT_LETTER => 'Surat Pernyataan',
            self::LETTER_OF_SUPPORT => 'Surat Dukungan',
            self::INTEGRITY_PACT => 'Pakta Integritas',
        };
    }

    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
