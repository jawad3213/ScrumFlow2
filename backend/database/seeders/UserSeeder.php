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
            ['email' => 'aelhail71@gmail.com'],
            [
                'first_name' => 'Jaouad',
                'last_name' => 'El Hail',
                'password' => Hash::make('Password0690551161'),
                'role' => 'chef',
            ]
        );
    }
}
