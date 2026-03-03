<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\ProjectSeederService;
use App\Services\EmployeeSeederService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SpecializationSeeder::class,
            UserSeeder::class,
        ]);

        // Seed projects and employees for each chef user
        $chefs = User::where('role', 'chef')->get();
        foreach ($chefs as $chef) {
            ProjectSeederService::seedForUser($chef);
            EmployeeSeederService::seedForUser($chef);
            $this->command->info("Seeded project + employees for {$chef->first_name} {$chef->last_name}");
        }
    }
}
