<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
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
            'assignedEngineers.user.specialization'
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
            'user_id' => 'required|exists:users,id',
        ]);

        return DB::transaction(function () use ($request, $projectId) {
            $assignment = AssignedEngineer::where('project_id', $projectId)
                ->where('id', $request->assigned_engineer_id)
                ->firstOrFail();

            $user = User::findOrFail($request->user_id);

            // 1. Unassign previous user if any
            if ($assignment->user_id) {
                User::where('id', $assignment->user_id)->update(['is_engaged' => false]);
            }

            // 2. Assign new user
            $assignment->user_id = $user->id;
            $assignment->save();

            // 3. Mark user as engaged
            $user->is_engaged = true;
            $user->save();

            return response()->json([
                'message' => 'Employee assigned successfully',
                'assignment' => $assignment->load(['user.specialization', 'specialization'])
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

            if ($assignment->user_id) {
                User::where('id', $assignment->user_id)->update(['is_engaged' => false]);
                $assignment->user_id = null;
                $assignment->save();
            }

            return response()->json([
                'message' => 'Employee unassigned successfully'
            ]);
        });
    }
}
