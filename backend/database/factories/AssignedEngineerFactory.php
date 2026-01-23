<?php

namespace Database\Factories;

use App\Models\AssignedEngineer;
use App\Models\Project;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignedEngineerFactory extends Factory
{
    protected $model = AssignedEngineer::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'specialization_id' => Specialization::factory(),
            'user_id' => User::factory(),
            'phase' => $this->faker->randomElement(['development', 'maintenance']),
            'months_assigned' => $this->faker->randomFloat(2, 1, 12),
        ];
    }
}
