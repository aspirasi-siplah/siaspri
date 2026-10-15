<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('PRG-####')),
            'name' => 'Program '.fake()->words(2, true),
            'year' => (int) fake()->year(),
            'id_fund' => fake()->optional()->uuid(),
        ];
    }
}
