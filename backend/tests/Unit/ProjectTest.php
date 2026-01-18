<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that start_date is set when status becomes active.
     */
    public function test_start_date_is_set_when_status_is_active()
    {
        $project = Project::create([
            'name' => 'Test Project',
            'status' => 'pending',
        ]);

        $this->assertNull($project->start_date);

        // Update status to active
        $project->update(['status' => 'active']);

        $this->assertEquals(Carbon::now()->toDateString(), $project->fresh()->start_date);
    }

    /**
     * Test that actual_end_date is set when status becomes completed.
     */
    public function test_actual_end_date_is_set_when_status_is_completed()
    {
        $project = Project::create([
            'name' => 'Test Project',
            'status' => 'active',
            'start_date' => now()->subMonth(),
        ]);

        $this->assertNull($project->actual_end_date);

        // Update status to completed
        $project->update(['status' => 'completed']);

        $this->assertEquals(Carbon::now()->toDateString(), $project->fresh()->actual_end_date);
    }

    /**
     * Test that planned_end_date is calculated correctly.
     */
    public function test_planned_end_date_is_calculated()
    {
        $startDate = '2024-01-01';
        $durationMonths = 3;

        $project = Project::create([
            'name' => 'Test Project',
            'start_date' => $startDate,
            'estimated_duration_months' => $durationMonths,
        ]);

        $expectedEndDate = Carbon::parse($startDate)->addMonths($durationMonths)->toDateString();

        $this->assertEquals($expectedEndDate, $project->fresh()->planned_end_date);
    }
}
