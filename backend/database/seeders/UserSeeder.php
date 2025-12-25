<?php

namespace Database\Seeders;

use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
            ['Marcus', 'Chen', 'marcus.c@taskflow.com', 'Fullstack Developer', 'Software Architect', 'active'],
            ['Sarah', 'Johnson', 'sarah.j@taskflow.com', 'Backend Developer', 'Mid-level', 'banned'],
            ['David', 'Smith', 'david.s@taskflow.com', 'DevOps Engineer', 'Senior', 'active'],
            ['Jessica', 'Davis', 'jessica.d@taskflow.com', 'Project Manager', 'Senior PM', 'active'],
            ['Michael', 'Brown', 'michael.b@taskflow.com', 'QA Engineer', 'Junior', 'active'],
            ['Lucas', 'Miller', 'lucas.m@taskflow.com', 'Fullstack Developer', 'Senior', 'active'], // Changed status to active
            ['Sophia', 'Taylor', 'sophia.t@taskflow.com', 'UI/UX Designer', 'Junior', 'active'],
            ['Daniel', 'Anderson', 'daniel.a@taskflow.com', 'Backend Developer', 'Senior', 'active'],
        ];

        foreach ($employees as $emp) {
            // Find the specialization ID based on Name and Level
            $specialization = Specialization::where('name', $emp[3])
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
