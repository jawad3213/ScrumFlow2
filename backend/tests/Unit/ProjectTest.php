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
