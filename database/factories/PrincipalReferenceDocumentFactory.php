<?php

namespace Database\Factories;

use App\Models\PrincipalReferenceDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PrincipalReferenceDocument>
 */
class PrincipalReferenceDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference_id' => PrincipalReferenceDocument::generateReferenceId(),
            'principal_name' => fake()->company(),
            'document_number' => strtoupper(fake()->bothify('DOC-####-???')),
            'program_name' => fake()->sentence(3),
            'category_name' => fake()->word(),
            'status' => fake()->randomElement([
                PrincipalReferenceDocument::STATUS_ACTIVE,
                PrincipalReferenceDocument::STATUS_INACTIVE,
                PrincipalReferenceDocument::STATUS_EXPIRED,
            ]),
            'expired_date' => fake()->dateTimeBetween('+1 month', '+2 years')->format('Y-m-d'),
        ];
    }
}
