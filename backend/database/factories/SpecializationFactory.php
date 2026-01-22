<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Specialization>
 */
class SpecializationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Developer',
            'level' => $this->faker->randomElement(['Junior', 'Mid-level', 'Senior']),
            'salary' => $this->faker->numberBetween(5000, 20000),
        ];
    }
}
