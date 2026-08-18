<?php

namespace Database\Factories;

use App\Models\PrincipalReferenceDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PrincipalReferenceDocument>
 */
class PrincipalReferenceDocumentFactory extends Factory
{
    public function definition(): array
    {
        $programName = fake()->optional()->words(3, true);

        return [
            'reference_id' => PrincipalReferenceDocument::generateReferenceId($programName ?? 'BP'),
            'principal_name' => fake()->company(),
            'company_name' => fake()->company(),
            'document_number' => strtoupper(fake()->bothify('DOC-####-???')),
            'program_name' => $programName,
            'category_name' => fake()->optional()->word(),
            'status' => fake()->randomElement([
                PrincipalReferenceDocument::STATUS_ACTIVE,
                PrincipalReferenceDocument::STATUS_INACTIVE,
                PrincipalReferenceDocument::STATUS_EXPIRED,
            ]),
            'expired_date' => fake()->optional(70)->dateTimeBetween('+1 month', '+2 years')?->format('Y-m-d'),
        ];
    }
}
