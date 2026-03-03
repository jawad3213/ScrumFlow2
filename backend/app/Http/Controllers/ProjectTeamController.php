<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Employee;
use App\Models\AssignedEngineer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectTeamController extends Controller
{
    /**
     * Get the project team (assigned roles and employees)
     */
    public function index($projectId)
    {
        $project = Project::with([
            'assignedEngineers.specialization',
            'assignedEngineers.employee.specialization'
        ])->findOrFail($projectId);

        return response()->json([
            'project' => $project->name,
            'team' => $project->assignedEngineers
        ]);
    }

    /**
     * Assign a specific employee to a role requirement
     */
    public function assign(Request $request, $projectId)
    {
        $request->validate([
            'assigned_engineer_id' => 'required|exists:assigned_engineers,id',
            'user_id' => 'required|exists:employees,id',
        ]);

        return DB::transaction(function () use ($request, $projectId) {
            $assignment = AssignedEngineer::where('project_id', $projectId)
                ->where('id', $request->assigned_engineer_id)
                ->firstOrFail();

            $employee = Employee::findOrFail($request->user_id);

            // 1. Unassign previous employee if any
            if ($assignment->employee_id) {
                Employee::where('id', $assignment->employee_id)->update(['is_engaged' => false]);
            }

            // 2. Assign new employee
            $assignment->employee_id = $employee->id;
            $assignment->save();

            // 3. Mark employee as engaged
            $employee->is_engaged = true;
            $employee->save();

            return response()->json([
                'message' => 'Employee assigned successfully',
                'assignment' => $assignment->load(['employee.specialization', 'specialization'])
            ]);
        });
    }

    /**
     * Remove an employee from a role requirement
     */
    public function unassign(Request $request, $projectId)
    {
        $request->validate([
            'assigned_engineer_id' => 'required|exists:assigned_engineers,id',
        ]);

        return DB::transaction(function () use ($request, $projectId) {
            $assignment = AssignedEngineer::where('project_id', $projectId)
                ->where('id', $request->assigned_engineer_id)
                ->firstOrFail();

            if ($assignment->employee_id) {
                Employee::where('id', $assignment->employee_id)->update(['is_engaged' => false]);
                $assignment->employee_id = null;
                $assignment->save();
            }

            return response()->json([
                'message' => 'Employee unassigned successfully'
            ]);
        });
    }
}
