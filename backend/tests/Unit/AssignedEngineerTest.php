<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Models\Specialization;
use App\Models\AssignedEngineer;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AssignedEngineerTest extends TestCase
{
    use RefreshDatabase;

    public function test_assigned_engineer_belongs_to_project()
    {
        $project = Project::factory()->create();
        $engineer = AssignedEngineer::create([
            'project_id' => $project->id,
            'specialization_id' => Specialization::factory()->create()->id,
            'phase' => 'development',
            'months_assigned' => 3
        ]);

        $this->assertInstanceOf(Project::class, $engineer->project);
        $this->assertEquals($project->id, $engineer->project->id);
    }

    public function test_assigned_engineer_belongs_to_specialization()
    {
        $specialization = Specialization::factory()->create();
        $engineer = AssignedEngineer::create([
            'project_id' => Project::factory()->create()->id,
            'specialization_id' => $specialization->id,
            'phase' => 'development',
            'months_assigned' => 3
        ]);

        $this->assertInstanceOf(Specialization::class, $engineer->specialization);
        $this->assertEquals($specialization->id, $engineer->specialization->id);
    }
}
