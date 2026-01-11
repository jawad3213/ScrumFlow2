<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Models\Specialization;
use App\Models\AssignedEngineer;
use App\Models\EstimatedGain;
use App\Models\InfrastructureCost;
use App\Models\RoiProjection;
use App\Models\ProjectKpi;
use App\Models\ProjectRisk;
use App\Models\User;
use App\Models\Sprint;
use App\Models\ProjectEpic;
use App\Models\ProjectStory;
use App\Models\ProjectBlueprintTask;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        $projects = Project::with(['chef', 'assignedEngineers.specialization', 'kpis', 'risks'])->latest()->get();
        return response()->json($projects);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        // If the user provided a name in the request 'name' field, prioritize it.
        // If not, and 'project_name' exists, use that.
        if (!$request->has('name') || empty($request->input('name'))) {
            if ($request->has('project_name')) {
                $request->merge(['name' => $request->project_name]);
            }
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed: ' . implode(', ', $validator->errors()->all()),
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // 1. Prepare Project Data
                $projectData = $request->only([
                    'name', 'description', 'status',
                    'start_date', 'actual_end_date',
                    'estimated_duration_months', 'total_capex', 'total_opex',
                    'total_project_cost', 'total_gain_value', 'annual_opex_value',
                    'roi_analysis_summary'
                ]);

                // Map project_name to name if name is missing (for AI compatibility)
                $projectData['name'] = ($request->name && strlen($request->name) > 0) ? $request->name : $request->project_name;
                
                // Final validation check for name
                if (empty($projectData['name'])) {
                    throw new \Exception("The project name is still empty after synthesis. Please provide a name in Step 1.");
                }

                // Default values if missing
                $projectData['status'] = $request->status ?? 'pending';
                $projectData['user_id'] = $request->user()?->id ?? $request->user_id;

                // Handle nested ROI data mapping
                if ($request->has('roi_projections')) {
                    $roiData = $request->roi_projections;
                    if (is_array($roiData)) {
                        $projectData['break_even_point_months'] = $roiData['break_even_point_months'] ?? null;
                        
                        // Use year 3 ROI as overall project ROI
                        if (isset($roiData['year_3']['roi_percentage'])) {
                            $projectData['roi_percentage'] = $roiData['year_3']['roi_percentage'];
                        }
                    }
                }

                $project = Project::create($projectData);

                // 2. Save Assigned Engineers (Development Phase)
                if ($request->has('selected_engineers')) {
                    foreach ($request->selected_engineers as $eng) {
                        $spec = Specialization::firstOrCreate(
                            [
                                'name' => $eng['role'] ?? $eng['specialization'] ?? 'Unknown',
                                'level' => $eng['level'] ?? 'Mid-level'
                            ],
                            [
                                'salary' => $eng['monthly_salary_mad'] ?? $eng['salary'] ?? 0
                            ]
                        );

                        $project->assignedEngineers()->create([
                            'phase' => 'development',
                            'specialization_id' => $spec->id,
                            'months_assigned' => $eng['months_assigned'] ?? 1,
                        ]);
                    }
                }

                // 3. Save Maintenance Engineers (OPEX Phase)
                if ($request->has('maintenance_engineers')) {
                    foreach ($request->maintenance_engineers as $eng) {
                        $spec = Specialization::firstOrCreate(
                            [
                                'name' => $eng['role'] ?? $eng['specialization'] ?? 'Unknown',
                                'level' => $eng['level'] ?? 'Mid-level'
                            ],
                            [
                                'salary' => $eng['monthly_salary_mad'] ?? $eng['salary'] ?? 0
                            ]
                        );

                        $project->assignedEngineers()->create([
                            'phase' => 'maintenance',
                            'specialization_id' => $spec->id,
                            'months_assigned' => $eng['months_assigned'] ?? 12,
                        ]);
                    }
                }

                // 4. Save Estimated Gains
                if ($request->has('estimated_gains')) {
                    foreach ($request->estimated_gains as $gain) {
                        $project->estimatedGains()->create([
                            'item_name' => $gain['item_name'] ?? 'Gain Item',
                            'cost_mad' => $gain['cost_mad'] ?? 0,
                            'formule' => $gain['formule'] ?? null,
                            'description' => $gain['description'] ?? null
                        ]);
                    }
                }

                // 5. Save Infrastructure Costs (Licenses & APIs)
                if ($request->has('licenses_and_apis')) {
                    foreach ($request->licenses_and_apis as $infra) {
                        $project->infrastructureCosts()->create([
                            'type' => 'capex',
                            'item_name' => $infra['item_name'] ?? 'License',
                            'cost_mad' => $infra['cost_mad'] ?? 0,
                            'formule' => $infra['formule'] ?? null,
                            'description' => $infra['description'] ?? null
                        ]);
                    }
                }

                // 6. Save Infrastructure Costs (Cloud Subscriptions)
                if ($request->has('cloud_subscription')) {
                    foreach ($request->cloud_subscription as $infra) {
                        $project->infrastructureCosts()->create([
                            'type' => 'opex',
                            'item_name' => $infra['item_name'] ?? 'Subscription',
                            'cost_mad' => $infra['cost_mad'] ?? 0,
                            'formule' => $infra['formule'] ?? null,
                            'description' => $infra['description'] ?? null
                        ]);
                    }
                }

                // 7. Save ROI Projections
                if ($request->has('roi_projections')) {
                    $projs = is_array($request->roi_projections) ? $request->roi_projections : [];
                    foreach ($projs as $key => $proj) {
                        if (is_string($key) && strpos($key, 'year_') === 0) {
                            $yearNum = (int) substr($key, 5);
                            $project->roiProjections()->create([
                                'year_number' => $yearNum,
                                'cumulative_costs' => $proj['cumulative_costs'] ?? 0,
                                'cumulative_gains' => $proj['cumulative_gains'] ?? 0,
                                'net_cash_flow' => $proj['net_cash_flow'] ?? 0,
                                'roi_percentage' => $proj['roi_percentage'] ?? 0
                            ]);
                        }
                    }
                }

                // 8. Save KPIs
                if ($request->has('kpis')) {
                    foreach ($request->kpis as $kpi) {
                        $project->kpis()->create([
                            'metric_name' => $kpi['metric_name'],
                            'target_value' => $kpi['target_value'],
                            'measurement_method' => $kpi['measurement_method']
                        ]);
                    }
                }

                // 9. Save Risks
                if ($request->has('risk_assessment')) {
                    foreach ($request->risk_assessment as $risk) {
                        $project->risks()->create([
                            'risk_name' => $risk['risk_name'],
                            'impact' => $risk['impact'],
                            'probability' => $risk['probability'],
                            'mitigation_strategy' => $risk['mitigation_strategy']
                        ]);
                    }
                }

                // 10. Save AI Backlog (Epics -> Stories -> Tasks)
                if ($request->has('backlog')) {
                    foreach ($request->backlog as $epicData) {
                        $epic = $project->epics()->create([
                            'title' => $epicData['title'],
                            'description' => $epicData['description'],
                            'external_id' => $epicData['id'] ?? null,
                        ]);

                        if (isset($epicData['user_stories'])) {
                            foreach ($epicData['user_stories'] as $storyData) {
                                $story = $epic->stories()->create([
                                    'title' => $storyData['title'],
                                    'description' => $storyData['description'],
                                    'story_points' => $storyData['story_points'] ?? 0,
                                    'acceptance_criteria' => $storyData['acceptance_criteria'] ?? [],
                                    'external_id' => $storyData['id'] ?? null,
                                ]);

                                if (isset($storyData['tasks'])) {
                                    foreach ($storyData['tasks'] as $taskData) {
                                        $story->tasks()->create([
                                            'role' => $taskData['role'],
                                            'level' => $taskData['level'] ?? null,
                                            'title' => $taskData['title'],
                                            'instructions' => $taskData['instructions'],
                                            'hours' => $taskData['hours'] ?? 0,
                                            'external_id' => $taskData['id'] ?? null,
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }

                return response()->json([
                    'message' => 'Project and AI analysis blueprint saved successfully.',
                    'project' => $project->load(['chef', 'assignedEngineers.specialization', 'estimatedGains', 'infrastructureCosts', 'roiProjections', 'kpis', 'risks', 'epics.stories.tasks'])
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save project blueprint.',
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Display the specified project.
     */
    public function show($id)
    {
        $project = Project::with(['chef', 'sprints', 'assignedEngineers.specialization', 'estimatedGains', 'infrastructureCosts', 'roiProjections', 'kpis', 'risks', 'epics.stories.tasks'])->find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json($project);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,active,completed',
            'user_id' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'planned_end_date' => 'nullable|date|after_or_equal:start_date',
            'actual_end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($request->all());

        // Update Backlog if provided (AI Analysis result)
        if ($request->has('backlog')) {
            // Remove existing backlog to replace with new analysis
            $project->epics()->each(function ($epic) {
                $epic->stories()->each(function ($story) {
                    $story->tasks()->delete();
                });
                $epic->stories()->delete();
            });
            $project->epics()->delete();

            foreach ($request->backlog as $epicData) {
                $epic = $project->epics()->create([
                    'title' => $epicData['title'],
                    'description' => $epicData['description'],
                    'external_id' => $epicData['id'] ?? null,
                ]);

                if (isset($epicData['user_stories'])) {
                    foreach ($epicData['user_stories'] as $storyData) {
                        $story = $epic->stories()->create([
                            'title' => $storyData['title'],
                            'description' => $storyData['description'],
                            'story_points' => $storyData['story_points'] ?? 0,
                            'acceptance_criteria' => $storyData['acceptance_criteria'] ?? [],
                            'external_id' => $storyData['id'] ?? null,
                        ]);

                        if (isset($storyData['tasks'])) {
                            foreach ($storyData['tasks'] as $taskData) {
                                $story->tasks()->create([
                                    'role' => $taskData['role'],
                                    'level' => $taskData['level'] ?? null,
                                    'title' => $taskData['title'],
                                    'instructions' => $taskData['instructions'],
                                    'hours' => $taskData['hours'] ?? 0,
                                    'external_id' => $taskData['id'] ?? null,
                                ]);
                            }
                        }
                    }
                }
            }
        }

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project->load(['chef', 'epics.stories.tasks'])
        ]);
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
