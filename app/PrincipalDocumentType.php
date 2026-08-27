<?php

namespace App;

enum PrincipalDocumentType: string
{
    case STATEMENT_LETTER = 'STATEMENT_LETTER';
    case LETTER_OF_SUPPORT = 'LETTER_OF_SUPPORT';
    case INTEGRITY_PACT = 'INTEGRITY_PACT';

    public function label(): string
    {
        return match ($this) {
            self::STATEMENT_LETTER => 'Statement Letter',
            self::LETTER_OF_SUPPORT => 'Letter of Support',
            self::INTEGRITY_PACT => 'Integrity Pact',
        };
    }
}
