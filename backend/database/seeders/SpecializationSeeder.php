<?php

namespace Database\Seeders;

use App\Models\Specialization;
use Illuminate\Database\Seeder;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create a Matrix of Specializations
        $roles = [
            'Frontend Developer' => ['Junior', 'Mid-level', 'Senior', 'Lead / Architect'],
            'Backend Developer' => ['Junior', 'Mid-level', 'Senior', 'Lead / Architect'],
            'Fullstack Developer' => ['Junior', 'Mid-level', 'Senior', 'Lead / Architect'],
            'UI/UX Designer' => ['Junior', 'Mid-level', 'Senior'],
            'DevOps Engineer' => ['Mid-level', 'Senior', 'Lead / Architect'],
            'Project Manager' => ['Senior', 'Lead / Architect'],
            'QA Engineer' => ['Junior', 'Mid-level', 'Senior'],
        ];

        foreach ($roles as $role => $levels) {
            foreach ($levels as $level) {
                // Determine base salary based on role and level (approximate logic)
                $baseSalary = match ($level) {
                    'Junior' => 3000,
                    'Mid-level' => 4500,
                    'Senior' => 6500,
                    'Lead / Architect' => 9000,
                };
                
                // Adjust per role typically
                if (str_contains($role, 'Manager') || str_contains($role, 'Lead')) {
                    $baseSalary += 1000;
                }

                // Use firstOrCreate to avoid duplicates
                Specialization::firstOrCreate(
                    ['name' => $role, 'level' => $level],
                    ['salary' => $baseSalary]
                );
            }
        }
    }
}
