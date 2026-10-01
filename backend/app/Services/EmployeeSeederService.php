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
        $specializations = Specialization::all();

        $moroccanFirstNames = [
            'Amine', 'Mehdi', 'Youssef', 'Hamza', 'Omar', 'Karim', 'Hassan', 'Othmane', 'Ilyas', 'Ayoub', 'Yassine', 'Walid', 'Zakaria', 'Badr', 'Soufiane',
            'Sara', 'Fatima', 'Salma', 'Kenza', 'Meriem', 'Houda', 'Zineb', 'Nada', 'Meryem', 'Kawtar', 'Leila', 'Imane', 'Ghita', 'Asmaa', 'Rim'
        ];
        
        $moroccanLastNames = [
            'El Fassi', 'Benjelloun', 'Berrada', 'Tazi', 'Chraibi', 'Guessous', 'Benkirane', 'Tahiri', 'Alaoui', 'Amrani', 'Lahlou', 'Boujida', 'Naciri', 'Idrissi', 'Ouazzani',
            'Benali', 'Rhomari', 'Bekkari', 'Fettah', 'Bennis'
        ];

        foreach ($specializations as $specialization) {
            $employeeCount = Employee::where('user_id', $user->id)
                ->where('specialization_id', $specialization->id)
                ->count();

            if ($employeeCount === 0) {
                $firstName = $moroccanFirstNames[array_rand($moroccanFirstNames)];
                $lastName = $moroccanLastNames[array_rand($moroccanLastNames)];
                
                $emailPrefix = strtolower(str_replace(' ', '', $firstName . '.' . $lastName));
                
                Employee::create([
                    'user_id' => $user->id,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $emailPrefix . '@growtrack.com',
                    'specialization_id' => $specialization->id,
                    'is_engaged' => false,
                ]);
            }
        }
    }
}
