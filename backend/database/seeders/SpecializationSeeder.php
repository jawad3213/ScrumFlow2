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
            'Frontend Developer' => ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer'],
            'Backend Developer'  => ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
            'Fullstack Developer'=> ['Intern', 'Junior', 'Mid-level', 'Senior', 'Tech Lead', 'Software Architect'],
            'UI/UX Designer'     => ['Junior', 'Mid-level', 'Senior', 'Lead Designer', 'Design Principal'],
            'DevOps Engineer'    => ['Junior', 'Mid-level', 'Senior', 'SRE', 'Cloud Architect'],
            'Project Manager'    => ['Junior PM', 'Project Manager', 'Senior PM', 'Program Manager', 'Portfolio Manager'],
            'QA Engineer'        => ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
        ];

        // 2. Define salary mapping (mid-range values in MAD/month)
        $salaryMap = [
            // Frontend Developer
            'Frontend Developer|Intern' => 1000,
            'Frontend Developer|Junior' => 8500,
            'Frontend Developer|Mid-level' => 15000,
            'Frontend Developer|Senior' => 27500,
            'Frontend Developer|Staff Engineer' => 42500,
            
            // Backend Developer
            'Backend Developer|Intern' => 1250,
            'Backend Developer|Junior' => 9500,
            'Backend Developer|Mid-level' => 16000,
            'Backend Developer|Senior' => 30000,
            'Backend Developer|Staff Engineer' => 46500,
            'Backend Developer|Software Architect' => 61500,
            
            // Fullstack Developer
            'Fullstack Developer|Intern' => 1500,
            'Fullstack Developer|Junior' => 10500,
            'Fullstack Developer|Mid-level' => 17000,
            'Fullstack Developer|Senior' => 31000,
            'Fullstack Developer|Tech Lead' => 45000,
            'Fullstack Developer|Software Architect' => 60000,
            
            // UI/UX Designer
            'UI/UX Designer|Junior' => 9000,
            'UI/UX Designer|Mid-level' => 14500,
            'UI/UX Designer|Senior' => 23000,
            'UI/UX Designer|Lead Designer' => 37500,
            'UI/UX Designer|Design Principal' => 52500,
            
            // DevOps Engineer
            'DevOps Engineer|Junior' => 11500,
            'DevOps Engineer|Mid-level' => 19500,
            'DevOps Engineer|Senior' => 35500,
            'DevOps Engineer|SRE' => 38000,
            'DevOps Engineer|Cloud Architect' => 47500,
            
            // Project Manager
            'Project Manager|Junior PM' => 10500,
            'Project Manager|Project Manager' => 18000,
            'Project Manager|Senior PM' => 35000,
            'Project Manager|Program Manager' => 45000,
            'Project Manager|Portfolio Manager' => 57500,
            
            // QA Engineer
            'QA Engineer|Intern' => 2000,
            'QA Engineer|Junior' => 10500,
            'QA Engineer|Mid-level' => 17500,
            'QA Engineer|Senior' => 30500,
            'QA Engineer|Staff Engineer' => 46500,
            'QA Engineer|Software Architect' => 57500,
        ];

        foreach ($roles as $role => $levels) {
            foreach ($levels as $level) {
                $key = $role . '|' . $level;
                $baseSalary = $salaryMap[$key] ?? 10000;
                
                Specialization::firstOrCreate(
                    ['name' => $role, 'level' => $level],
                    ['salary' => $baseSalary]
                );
            }
        }
    }
}
