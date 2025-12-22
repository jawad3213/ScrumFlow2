<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chef = User::where('role', 'chef')->first();

        if (!$chef) {
            return;
        }

        $projects = [
            [
                'name' => 'Project Alpha',
                'description' => 'A revolutionary new platform for task management and team collaboration.',
                'start_date' => now()->subDays(10)->format('Y-m-d'),
                'end_date' => now()->addMonths(3)->format('Y-m-d'),
                'status' => 'active',
                'user_id' => $chef->id,
            ],
            [
                'name' => 'Website Redesign',
                'description' => 'Modernizing our corporate website with a fresh look and improved UX.',
                'start_date' => now()->subDays(5)->format('Y-m-d'),
                'end_date' => now()->addMonths(2)->format('Y-m-d'),
                'status' => 'active',
                'user_id' => $chef->id,
            ],
            [
                'name' => 'Mobile App Expansion',
                'description' => 'Bringing our platform to iOS and Android with a native experience.',
                'start_date' => now()->addDays(5)->format('Y-m-d'),
                'end_date' => now()->addMonths(6)->format('Y-m-d'),
                'status' => 'pending',
                'user_id' => $chef->id,
            ],
            [
                'name' => 'Marketing Campaign Q1',
                'description' => 'Strategic marketing push for the first quarter of the year.',
                'start_date' => now()->subMonths(2)->format('Y-m-d'),
                'end_date' => now()->subDays(1)->format('Y-m-d'),
                'status' => 'completed',
                'user_id' => $chef->id,
            ],
        ];

        foreach ($projects as $project) {
            Project::firstOrCreate(
                ['name' => $project['name']],
                $project
            );
        }
    }
}
