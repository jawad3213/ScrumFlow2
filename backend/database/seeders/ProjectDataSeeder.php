<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\ProjectSeederService;
use Illuminate\Database\Seeder;

class ProjectDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get all Users
        $users = User::all();
        if ($users->isEmpty()) {
            $users = collect([User::factory()->create(['role' => 'chef', 'email' => 'chef@growtrack.com', 'first_name' => 'Super', 'last_name' => 'Chef'])]);
        }

        foreach ($users as $user) {
            ProjectSeederService::seedForUser($user);
            $this->command->info("Project Data seeded successfully with ScrumFlow content for {$user->first_name} {$user->last_name}!");
        }
    }
}
