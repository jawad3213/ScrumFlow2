<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Only creates chef (admin) users. Employees are now seeded separately.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'chef@projet.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Chef',
                'password' => Hash::make('password123'),
                'role' => 'chef',
            ]
        );

        User::firstOrCreate(
            ['email' => 'aelhail71@gmail.com'],
            [
                'first_name' => 'Jaouad',
                'last_name' => 'Aelhail',
                'password' => Hash::make('Password123'),
                'role' => 'chef',
            ]
        );
    }
}
