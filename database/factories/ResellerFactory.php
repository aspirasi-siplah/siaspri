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
            'name' => $name = fake()->company(),
            'npwp_number' => fake()->optional()->numerify('##.###.###.#-###.###'),
            'document_number' => fake()->optional()->bothify('DOC-####-???'),
            'document_path' => null,
            'reference_code' => 'ASPRI-'.Reseller::nameAbbreviation($name).'-'.str_pad(
                (string) fake()->numberBetween(0, 99999),
                5,
                '0',
                STR_PAD_LEFT
            ),
        ];
    }
}
