<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Models\InfrastructureCost;
use App\Models\EstimatedGain;
use App\Models\RoiProjection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FinancialsTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_has_infrastructure_costs()
    {
        $project = Project::factory()->create();
        $cost = InfrastructureCost::create([
            'project_id' => $project->id,
            'type' => 'capex',
            'item_name' => 'Server',
            'cost_mad' => 1000
        ]);

        $this->assertTrue($project->infrastructureCosts->contains($cost));
    }

    public function test_project_has_estimated_gains()
    {
        $project = Project::factory()->create();
        $gain = EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => 'Efficiency',
            'cost_mad' => 5000
        ]);

        $this->assertTrue($project->estimatedGains->contains($gain));
    }

    public function test_project_has_roi_projections()
    {
        $project = Project::factory()->create();
        $roi = RoiProjection::create([
            'project_id' => $project->id,
            'year_number' => 1,
            'cumulative_costs' => 1000,
            'cumulative_gains' => 1500,
            'net_cash_flow' => 500,
            'roi_percentage' => 50
        ]);

        $this->assertTrue($project->roiProjections->contains($roi));
    }
}
