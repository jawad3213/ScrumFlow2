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
            'Frontend Developer' => ['Intern', 'Junior', 'Mid-level', 'Senior'],
            'Backend Developer'  => ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
            'Fullstack Developer'=> ['Intern', 'Junior', 'Mid-level', 'Senior', 'Tech Lead'],
            'UI/UX Designer'     => ['Junior', 'Mid-level', 'Senior', 'Lead Designer', 'Design Principal'],
            'DevOps Engineer'    => ['Junior', 'Mid-level', 'Senior', 'SRE', 'Cloud Architect'],
            'Project Manager'    => ['Junior PM', 'Project Manager', 'Senior PM', 'Program Manager', 'Portfolio Manager'],
            'QA Engineer'        => ['Junior', 'Mid-level', 'Senior', 'QA Lead'],
        ];

        // 2. Define salary mapping (mid-range values in MAD/month)
        $salaryMap = [
            // Frontend Developer
            'Frontend Developer|Intern' => 3000,
            'Frontend Developer|Junior' => 7000,
            'Frontend Developer|Mid-level' => 14000,
            'Frontend Developer|Senior' => 20000,
            
            // Backend Developer
            'Backend Developer|Intern' => 3000,
            'Backend Developer|Junior' => 7000,
            'Backend Developer|Mid-level' => 14000,
            'Backend Developer|Senior' => 25000,
            'Backend Developer|Staff Engineer' => 34000,
            'Backend Developer|Software Architect' => 42500,
            
            // Fullstack Developer
            'Fullstack Developer|Intern' => 3000,
            'Fullstack Developer|Junior' => 7000,
            'Fullstack Developer|Mid-level' => 14000,
            'Fullstack Developer|Senior' => 26000,
            'Fullstack Developer|Tech Lead' => 37500,
            
            // UI/UX Designer
            'UI/UX Designer|Junior' => 5500,
            'UI/UX Designer|Mid-level' => 11000,
            'UI/UX Designer|Senior' => 20000,
            'UI/UX Designer|Lead Designer' => 28500,
            'UI/UX Designer|Design Principal' => 37500,
            
            // DevOps Engineer
            'DevOps Engineer|Junior' => 8000,
            'DevOps Engineer|Mid-level' => 16000,
            'DevOps Engineer|Senior' => 28500,
            'DevOps Engineer|SRE' => 32500,
            'DevOps Engineer|Cloud Architect' => 45000,
            
            // Project Manager
            'Project Manager|Junior PM' => 7000,
            'Project Manager|Project Manager' => 14000,
            'Project Manager|Senior PM' => 23000,
            'Project Manager|Program Manager' => 32500,
            'Project Manager|Portfolio Manager' => 45000,
            
            // QA Engineer
            'QA Engineer|Junior' => 5500,
            'QA Engineer|Mid-level' => 11000,
            'QA Engineer|Senior' => 18000,
            'QA Engineer|QA Lead' => 26000,
        ];

        foreach ($roles as $role => $levels) {
            foreach ($levels as $level) {
                $key = $role . '|' . $level;
                $baseSalary = $salaryMap[$key] ?? 10000;
                
                Specialization::updateOrCreate(
                    ['name' => $role, 'level' => $level],
                    ['salary' => $baseSalary]
                );
            }
        }
    }
}
