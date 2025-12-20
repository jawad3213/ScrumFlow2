<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
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
                \App\Models\Specialization::firstOrCreate(
                    ['name' => $role, 'level' => $level],
                    ['salary' => $baseSalary]
                );
            }
        }

        // 2. Create Chef Users
        User::firstOrCreate(
            ['email' => 'chef@projet.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Chef',
                'password' => Hash::make('password123'),
                'role' => 'chef',
                'status' => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'aelhail71@gmail.com'],
            [
                'first_name' => 'Jaouad',
                'last_name' => 'Aelhail',
                'password' => Hash::make('Password123'),
                'role' => 'chef',
                'status' => 'active',
            ]
        );

        // 3. Create Employee Users with separated Specialization and Level
        $employees = [
            // First Name, Last Name, Email, Specialization Name, Level, Status
            ['Ahmed', 'Aelhail', 'ahmed@projet.com', 'Frontend Developer', 'Junior', 'active'],
            ['Emily', 'Wilson', 'emily.w@taskflow.com', 'UI/UX Designer', 'Senior', 'active'],
            ['Marcus', 'Chen', 'marcus.c@taskflow.com', 'Fullstack Developer', 'Lead / Architect', 'active'],
            ['Sarah', 'Johnson', 'sarah.j@taskflow.com', 'Backend Developer', 'Mid-level', 'banned'],
            ['David', 'Smith', 'david.s@taskflow.com', 'DevOps Engineer', 'Senior', 'active'],
            ['Jessica', 'Davis', 'jessica.d@taskflow.com', 'Project Manager', 'Senior', 'active'],
            ['Michael', 'Brown', 'michael.b@taskflow.com', 'QA Engineer', 'Junior', 'active'],
            ['Lucas', 'Miller', 'lucas.m@taskflow.com', 'Fullstack Developer', 'Senior', 'on leave'],
            ['Sophia', 'Taylor', 'sophia.t@taskflow.com', 'UI/UX Designer', 'Junior', 'active'],
            ['Daniel', 'Anderson', 'daniel.a@taskflow.com', 'Backend Developer', 'Senior', 'active'],
        ];

        foreach ($employees as $emp) {
            // Find the specialization ID based on Name and Level
            $specialization = \App\Models\Specialization::where('name', $emp[3])
                ->where('level', $emp[4])
                ->first();

            $cleanStatus = ($emp[5] === 'on leave') ? 'active' : $emp[5];

            if ($specialization) {
                User::firstOrCreate(
                    ['email' => $emp[2]],
                    [
                        'first_name' => $emp[0],
                        'last_name' => $emp[1],
                        'password' => Hash::make('password123'),
                        'role' => 'employee',
                        'specialization_id' => $specialization->id,
                        'status' => $cleanStatus,
                    ]
                );
            }
        }
    }
}
