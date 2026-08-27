<?php

namespace Database\Factories;

use App\Models\Principal;
use App\Models\Reseller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reseller>
 */
class ResellerFactory extends Factory
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
            'name' => fake()->company(),
            'npwp_number' => fake()->optional()->numerify('##.###.###.#-###.###'),
            'document_number' => fake()->optional()->bothify('DOC-####-???'),
            'document_path' => null,
            'reference_code' => fake()->optional()->bothify('REF-########'),
        ];
    }
}
