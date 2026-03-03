<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Employee;
use App\Models\Project;
use App\Models\ProjectEpic;
use App\Models\ProjectStory;
use App\Models\AssignedEngineer;
use App\Models\Specialization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\SpecializationSeeder::class);
    }

    /** @test */
    public function dashboard_returns_correct_structure()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'stats' => [
                'total_projects',
                'total_budget',
                'total_gains',
                'average_roi',
                'engineer_count',
                'talent_utilization'
            ],
            'projects' => [
                '*' => [
                    'id',
                    'name',
                    'progress',
                    'roi',
                    'cost',
                    'chef',
                    'has_strategic',
                    'has_technical',
                    'has_stack',
                    'steps'
                ]
            ]
        ]);
    }

    /** @test */
    public function dashboard_calculates_total_projects_correctly()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        Project::factory()->count(3)->create(['user_id' => $chef->id]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'stats' => [
                'total_projects' => 3
            ]
        ]);
    }

    /** @test */
    public function dashboard_calculates_total_budget_correctly()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        Project::factory()->create([
            'user_id' => $chef->id,
            'total_project_cost' => 100000
        ]);

        Project::factory()->create([
            'user_id' => $chef->id,
            'total_project_cost' => 200000
        ]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'stats' => [
                'total_budget' => 300000
            ]
        ]);
    }

    /** @test */
    public function dashboard_calculates_average_roi_correctly()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        Project::factory()->create([
            'user_id' => $chef->id,
            'roi_percentage' => 50.0
        ]);

        Project::factory()->create([
            'user_id' => $chef->id,
            'roi_percentage' => 100.0
        ]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'stats' => [
                'average_roi' => 75.0
            ]
        ]);
    }

    /** @test */
    public function dashboard_counts_unique_engineers_correctly()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        $project1 = Project::factory()->create(['user_id' => $chef->id]);
        $project2 = Project::factory()->create(['user_id' => $chef->id]);

        $specialization = Specialization::factory()->create();
        $employee1 = Employee::factory()->create([
            'user_id' => $chef->id,
            'specialization_id' => $specialization->id
        ]);
        $employee2 = Employee::factory()->create([
            'user_id' => $chef->id,
            'specialization_id' => $specialization->id
        ]);

        // Assign employee1 to both projects (should count once)
        AssignedEngineer::create([
            'project_id' => $project1->id,
            'employee_id' => $employee1->id,
            'specialization_id' => $specialization->id,
            'months_assigned' => 6,
            'phase' => 'Development'
        ]);

        AssignedEngineer::create([
            'project_id' => $project2->id,
            'employee_id' => $employee1->id,
            'specialization_id' => $specialization->id,
            'months_assigned' => 3,
            'phase' => 'Development'
        ]);

        // Assign employee2 to project2
        AssignedEngineer::create([
            'project_id' => $project2->id,
            'employee_id' => $employee2->id,
            'specialization_id' => $specialization->id,
            'months_assigned' => 4,
            'phase' => 'Development'
        ]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'stats' => [
                'engineer_count' => 2 // Two unique engineers
            ]
        ]);
    }

    /** @test */
    public function dashboard_returns_analysis_progress_flags()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        $project = Project::factory()->create([
            'user_id' => $chef->id,
            'roi_analysis_summary' => 'Some analysis',
            'stack_name' => 'TALL Stack'
        ]);

        $epic = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'Test Epic',
            'description' => 'Description'
        ]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        
        $projectData = $response->json('projects.0');
        
        $this->assertTrue($projectData['has_strategic']);
        $this->assertTrue($projectData['has_technical']);
        $this->assertTrue($projectData['has_stack']);
    }

    /** @test */
    public function dashboard_returns_project_steps_hierarchy()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        $project = Project::factory()->create(['user_id' => $chef->id]);

        $epic = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'Authentication',
            'description' => 'User auth'
        ]);

        ProjectStory::create([
            'project_epic_id' => $epic->id,
            'title' => 'Login Feature',
            'description' => 'User login',
            'story_points' => 5
        ]);

        ProjectStory::create([
            'project_epic_id' => $epic->id,
            'title' => 'Logout Feature',
            'description' => 'User logout',
            'story_points' => 3
        ]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        
        $roadmap = $response->json('projects.0.roadmap');
        
        $this->assertCount(1, $roadmap); // One epic
        $this->assertEquals('Authentication', $roadmap[0]['title']);
        $this->assertEquals(2, $roadmap[0]['story_count']); // Two stories
    }

    /** @test */
    public function dashboard_returns_empty_when_no_projects_exist()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'stats' => [
                'total_projects' => 0,
                'total_budget' => 0,
                'total_gains' => 0,
                'average_roi' => 0,
                'engineer_count' => 0
            ],
            'projects' => []
        ]);
    }

    /** @test */
    public function dashboard_requires_authentication()
    {
        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(401);
    }

    /** @test */
    public function dashboard_returns_projects_ordered_by_latest()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        $this->actingAs($chef);

        $oldProject = Project::factory()->create([
            'user_id' => $chef->id,
            'name' => 'Old Project',
            'created_at' => now()->subDays(10)
        ]);

        $newProject = Project::factory()->create([
            'user_id' => $chef->id,
            'name' => 'New Project',
            'created_at' => now()
        ]);

        $response = $this->getJson('/api/projects/dashboard');

        $response->assertStatus(200);
        
        $projects = $response->json('projects');
        
        // First project should be the newest
        $this->assertEquals('New Project', $projects[0]['name']);
        $this->assertEquals('Old Project', $projects[1]['name']);
    }
}
