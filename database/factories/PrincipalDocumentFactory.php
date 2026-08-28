<?php

namespace Database\Factories;

use App\Enums\PrincipalDocumentType;
use App\Models\Principal;
use App\Models\PrincipalDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PrincipalDocument>
 */
class PrincipalDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'principal_id' => Principal::factory(),
            'name' => fake()->randomElement(PrincipalDocumentType::cases()),
            'path' => 'principal-documents/'.fake()->uuid().'.pdf',
        ];
    }
}
