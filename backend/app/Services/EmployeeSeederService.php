<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Specialization;
use App\Models\User;

class EmployeeSeederService
{
    /**
     * Seed default employees for a given chef user.
     */
    public static function seedForUser(User $user): void
    {
        $employees = [
            ['Ahmed', 'Aelhail', 'ahmed@projet.com', 'Frontend Developer', 'Junior'],
            ['Emily', 'Wilson', 'emily.w@growtrack.com', 'UI/UX Designer', 'Senior'],
            ['Marcus', 'Chen', 'marcus.c@growtrack.com', 'Fullstack Developer', 'Software Architect'],
            ['Sarah', 'Johnson', 'sarah.j@growtrack.com', 'Backend Developer', 'Mid-level'],
            ['David', 'Smith', 'david.s@growtrack.com', 'DevOps Engineer', 'Senior'],
            ['Jessica', 'Davis', 'jessica.d@growtrack.com', 'Project Manager', 'Senior PM'],
            ['Michael', 'Brown', 'michael.b@growtrack.com', 'QA Engineer', 'Junior'],
            ['Lucas', 'Miller', 'lucas.m@growtrack.com', 'Fullstack Developer', 'Senior'],
            ['Sophia', 'Taylor', 'sophia.t@growtrack.com', 'UI/UX Designer', 'Junior'],
            ['Daniel', 'Anderson', 'daniel.a@growtrack.com', 'Backend Developer', 'Senior'],
        ];

        foreach ($employees as $emp) {
            $specialization = Specialization::where('name', $emp[3])
                ->where('level', $emp[4])
                ->first();

            if ($specialization) {
                Employee::create([
                    'user_id' => $user->id,
                    'first_name' => $emp[0],
                    'last_name' => $emp[1],
                    'email' => $emp[2],
                    'specialization_id' => $specialization->id,
                    'is_engaged' => false,
                ]);
            }
        }
    }
}
