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
        // 1. Define the roles and their specific levels
        $roles = [
            'Frontend Developer' => ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
            'Backend Developer'  => ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
            'Fullstack Developer'=> ['Intern', 'Junior', 'Mid-level', 'Senior', 'Tech Lead', 'Software Architect'],
            'UI/UX Designer'     => ['Junior', 'Mid-level', 'Senior', 'Lead Designer', 'Design Principal'],
            'DevOps Engineer'    => ['Junior', 'Mid-level', 'Senior', 'SRE', 'Cloud Architect'],
            'Project Manager'    => ['Junior PM', 'Project Manager', 'Senior PM', 'Program Manager', 'Portfolio Manager'],
            'QA Engineer'        => ['Junior', 'Mid-level', 'Senior', 'QA Lead', 'SDET'],
        ];

        // 2. Define a salary mapping for different level "ranks"
        // This is a rough estimation to seed the data
        $salaryMap = [
            'Intern' => 2000,
            'Junior' => 3500,
            'Mid-level' => 5000,
            'Senior' => 7500,
            'Staff Engineer' => 9500,
            'Software Architect' => 12000,
            'Tech Lead' => 10000,
            'Lead Designer' => 9000,
            'Design Principal' => 11500,
            'SRE' => 8500,
            'Cloud Architect' => 12000,
            'Junior PM' => 4500,
            'Project Manager' => 7000,
            'Senior PM' => 9000,
            'Program Manager' => 11000,
            'Portfolio Manager' => 14000,
            'QA Lead' => 8500,
            'SDET' => 9000,
        ];

        foreach ($roles as $role => $levels) {
            foreach ($levels as $level) {
                // Find salary or default to something based on keyword
                $baseSalary = $salaryMap[$level] ?? 5000;
                
                // Use firstOrCreate to avoid duplicates
                Specialization::firstOrCreate(
                    ['name' => $role, 'level' => $level],
                    ['salary' => $baseSalary]
                );
            }
        }
    }
}
