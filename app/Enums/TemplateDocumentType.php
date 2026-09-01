<?php

namespace App\Enums;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

enum TemplateDocumentType: string implements Arrayable, JsonSerializable
{
    case SURAT_PERNYATAAN = 'SURAT_PERNYATAAN';
    case SURAT_DUKUNGAN = 'SURAT_DUKUNGAN';
    case PAKTA_INTEGRITAS = 'PAKTA_INTEGRITAS';

    public function label(): string
    {
        return match ($this) {
            self::SURAT_PERNYATAAN => 'Surat Pernyataan',
            self::SURAT_DUKUNGAN => 'Surat Dukungan',
            self::PAKTA_INTEGRITAS => 'Pakta Integritas',
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
