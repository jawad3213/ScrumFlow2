<?php

namespace Tests\Feature;

use App\Models\AssignedEngineer;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssignedEngineerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test creating an assigned engineer with an employee.
     */
    public function test_can_create_assigned_engineer_with_user()
    {
        $project = Project::factory()->create();
        $specialization = Specialization::factory()->create(['salary' => 5000]);
        $employee = Employee::factory()->create();

        $assignedEngineer = AssignedEngineer::create([
            'project_id' => $project->id,
            'specialization_id' => $specialization->id,
            'employee_id' => $employee->id,
            'phase' => 'development',
            'months_assigned' => 6
        ]);

        $this->assertDatabaseHas('assigned_engineers', [
            'id' => $assignedEngineer->id,
            'employee_id' => $employee->id,
            'project_id' => $project->id,
        ]);

        $this->assertEquals($employee->id, $assignedEngineer->employee->id);
        $this->assertEquals($project->id, $assignedEngineer->project->id);
        $this->assertEquals($specialization->id, $assignedEngineer->specialization->id);
    }

    /**
     * Test the total_cost accessor.
     */
    public function test_total_cost_accessor_calculation()
    {
        $specialization = Specialization::factory()->create(['salary' => 5000]);
        $assignedEngineer = AssignedEngineer::factory()->create([
            'specialization_id' => $specialization->id,
            'months_assigned' => 3
        ]);

        // 5000 * 3 = 15000
        $this->assertEquals(15000, $assignedEngineer->total_cost);
    }

    /**
     * Test employee_id can be null if not assigned to a specific employee yet.
     */
    public function test_user_id_can_be_null()
    {
        $assignedEngineer = AssignedEngineer::factory()->create(['employee_id' => null]);

        $this->assertDatabaseHas('assigned_engineers', [
            'id' => $assignedEngineer->id,
            'employee_id' => null,
        ]);

        $this->assertNull($assignedEngineer->employee);
    }

    /**
     * Test that deleting an employee sets employee_id to null in assigned_engineers.
     */
    public function test_deleting_user_sets_user_id_to_null()
    {
        $employee = Employee::factory()->create();
        $assignedEngineer = AssignedEngineer::factory()->create(['employee_id' => $employee->id]);

        $employee->delete();

        $this->assertDatabaseHas('assigned_engineers', [
            'id' => $assignedEngineer->id,
            'employee_id' => null,
        ]);
    }
}
