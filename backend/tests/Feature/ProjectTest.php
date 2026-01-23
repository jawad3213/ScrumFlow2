<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Laravel\Sanctum\Sanctum;

class ProjectTest extends TestCase
{
    use RefreshDatabase; // Resets DB for each test

    /**
     * Test getting a list of projects.
     */
    public function test_can_list_projects()
    {
        // Create a user and authenticate
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Create some projects
        Project::create([
            'name' => 'Project A',
            'user_id' => $user->id,
        ]);
        Project::create([
            'name' => 'Project B',
            'user_id' => $user->id,
        ]);

        // Hit the endpoint
        $response = $this->getJson('/api/projects');

        // Assertions
        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    /**
     * Test creating a project.
     */
    public function test_can_create_project()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $payload = [
            'name' => 'New Awesome Project',
            'description' => 'A test description',
            'start_date' => '2024-01-01',
            'user_id' => $user->id
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'New Awesome Project']);

        $this->assertDatabaseHas('projects', ['name' => 'New Awesome Project']);
    }

    /**
     * Test showing a single project.
     */
    public function test_can_show_project()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::create([
            'name' => 'Single Project',
            'user_id' => $user->id,
        ]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Single Project']);
    }

    /**
     * Test updating a project.
     */
    public function test_can_update_project()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::create([
            'name' => 'Old Name',
            'user_id' => $user->id
        ]);

        $payload = ['name' => 'Updated Name'];

        $response = $this->putJson("/api/projects/{$project->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('projects', ['name' => 'Updated Name']);
    }

    /**
     * Test deleting a project.
     */
    public function test_can_delete_project()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::create([
            'name' => 'To Delete',
            'user_id' => $user->id
        ]);

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    /**
     * Test validation error when creating project without name.
     */
    public function test_cannot_create_project_without_name()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/projects', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_create_project_with_deep_relationships()
    {
        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        $payload = [
            'name' => 'Complex AI Project',
            'description' => 'A project with epics and stories',
            'backlog' => [
                [
                    'title' => 'Epic 1',
                    'description' => 'First Epic',
                    'user_stories' => [
                        [
                            'title' => 'Story 1',
                            'description' => 'First Story',
                            'story_points' => 5,
                            'tasks' => [
                                [
                                    'title' => 'Task 1',
                                    'role' => 'Backend',
                                    'instructions' => 'Write code',
                                    'hours' => 10
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'selected_engineers' => [
                ['role' => 'Backend Developer', 'level' => 'Senior', 'monthly_salary_mad' => 15000, 'months_assigned' => 3]
            ]
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('project_epics', ['title' => 'Epic 1']);
        $this->assertDatabaseHas('project_stories', ['title' => 'Story 1']);
        $this->assertDatabaseHas('project_blueprint_tasks', ['title' => 'Task 1']);
    }

    public function test_can_save_project_stack_analysis()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::create(['name' => 'Stack Test', 'user_id' => $user->id]);

        $payload = [
            'stack_analysis_data' => [
                'primary_recommendation' => [
                    'strategy_name' => 'Cloud Native',
                    'description' => 'Use AWS'
                ]
            ],
            'stack_name' => 'AWS Modern'
        ];

        $response = $this->postJson("/api/projects/{$project->id}/stack", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'stack_name' => 'AWS Modern'
        ]);
    }
}
