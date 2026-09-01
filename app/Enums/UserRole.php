<?php

namespace App\Enums;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

enum UserRole: string implements Arrayable, JsonSerializable
{
    case ADMIN = 'admin';
    case USER = 'user';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Superadmin',
            self::USER => 'Admin',
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
