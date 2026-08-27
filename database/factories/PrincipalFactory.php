<?php

namespace Database\Factories;

use App\Models\Principal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Principal>
 */
class PrincipalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'notes' => fake()->optional()->sentence(),
            'npwp_number' => fake()->optional()->numerify('##.###.###.#-###.###'),
            'nib' => fake()->optional()->numerify('###############'),
        ];
    }
}
