<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectEpic;
use App\Models\ProjectStory;
use App\Models\ProjectBlueprintTask;
use App\Models\EstimatedGain;
use App\Models\InfrastructureCost;
use App\Models\RoiProjection;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProjectDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get or Create a Chef User
        $chef = User::where('role', 'chef')->first() ?? User::factory()->create(['role' => 'chef', 'email' => 'chef@taskflow.com']);

        // 2. Create the Main Project
        $project = Project::create([
            'name' => 'TaskFlow CRM Pro',
            'description' => 'A comprehensive CRM system designed for small and medium enterprises to manage tasks and client relations.',
            'status' => 'active',
            'user_id' => $chef->id,
            'estimated_duration_months' => 12,
            'total_capex' => 50000,
            'total_opex' => 12000,
            'total_project_cost' => 62000,
            'total_gain_value' => 150000,
            'annual_opex_value' => 12000,
            'roi_percentage' => 141.94,
            'break_even_point_months' => 8,
            'roi_analysis_summary' => 'The project shows a strong ROI of 141% over three years with a relatively short payback period.',
            'stack_name' => 'TALL Stack (Tailwind, Alpine, Laravel, Livewire)',
        ]);

        // 3. Add Financials
        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => 'Productivity Improvement',
            'description' => 'Automated client reporting saving 10 hours/week per employee.',
            'cost_mad' => 45000,
        ]);

        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => 'Cost Reduction',
            'description' => 'Replacing legacy CRM subscription fees.',
            'cost_mad' => 15000,
        ]);

        InfrastructureCost::create([
            'project_id' => $project->id,
            'type' => 'cloud_subscription',
            'item_name' => 'AWS Cloud Infrastructure',
            'cost_mad' => 9600, // 800 * 12
            'description' => 'Monthly hosting fees for production and staging.',
        ]);

        InfrastructureCost::create([
            'project_id' => $project->id,
            'type' => 'license_api',
            'item_name' => 'Sentry Error Monitoring',
            'cost_mad' => 600, // 50 * 12
            'description' => 'Annual error tracking subscription.',
        ]);

        // Add some ROI Projections
        for ($i = 1; $i <= 3; $i++) {
            $cg = 60000 * $i;
            $cc = 20000 + (5000 * $i);
            RoiProjection::create([
                'project_id' => $project->id,
                'year_number' => $i,
                'cumulative_gains' => $cg,
                'cumulative_costs' => $cc,
                'net_cash_flow' => $cg - $cc,
                'roi_percentage' => (($cg - $cc) / max($cc, 1)) * 100,
            ]);
        }

        // 4. Add Backlog Hierarchy
        // Epic 1: Authentication & Security
        $epicAuth = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'Authentication & User Management',
            'description' => 'Secure login, registration, and role-based access control.',
        ]);

        $storyLogin = ProjectStory::create([
            'project_epic_id' => $epicAuth->id,
            'title' => 'Login via HttpOnly Cookies',
            'description' => 'As a user, I want to log in securely so that my session is protected from XSS attacks.',
            'story_points' => 5,
            'acceptance_criteria' => [
                'Verify JWT is stored in HttpOnly cookie',
                'Verify CSRF protection is active',
                'Verify session persistence across F5'
            ],
            'external_id' => 'US-1.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $storyLogin->id,
            'role' => 'Backend Developer',
            'level' => 'Senior',
            'title' => 'Implement Refresh Token Strategy',
            'instructions' => 'Create dedicated table for refresh tokens and implement cookie-based delivery in AuthController.',
            'hours' => 12,
            'external_id' => 'TASK-1.1.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $storyLogin->id,
            'role' => 'Frontend Developer',
            'level' => 'Mid',
            'title' => 'Axios Interceptor for 401 handling',
            'instructions' => 'Implement interceptor to catch 401 and attempt silent refresh via HttpOnly cookie.',
            'hours' => 8,
            'external_id' => 'TASK-1.1.2',
        ]);

        // Epic 2: Project ROI Dashboard
        $epicRoi = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'ROI Tracking Dashboard',
            'description' => 'Real-time visualization of project costs and gains.',
        ]);

        $storyChart = ProjectStory::create([
            'project_epic_id' => $epicRoi->id,
            'title' => 'ROI Projection Chart',
            'description' => 'As a manager, I want to see a chart of projected gains vs costs over 3 years.',
            'story_points' => 8,
            'acceptance_criteria' => [
                'Display line chart using Recharts',
                'Show break-even point marker',
                'Responsive layout'
            ],
            'external_id' => 'US-2.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $storyChart->id,
            'role' => 'Data Analyst',
            'level' => 'Junior',
            'title' => 'Define ROI Calculation Algorithm',
            'instructions' => 'Implement the formula in PHP to calculate cumulative ROI based on monthly OPEX/CAPEX.',
            'hours' => 6,
            'external_id' => 'TASK-2.1.1',
        ]);
        
        $this->command->info('Project Data seeded successfully!');
    }
}
