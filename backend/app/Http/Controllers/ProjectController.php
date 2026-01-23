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
// removed Sprint import
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
     * Get dashboard summary and project listing for system overview.
     */
    public function dashboard()
    {
        $projects = Project::with(['epics.stories', 'chef'])->latest()->get();
        
        $totalProjects = $projects->count();
        
        $totalCost = $projects->sum('total_project_cost');
        $totalGains = $projects->sum('total_gain_value');
        $averageRoi = $projects->avg('roi_percentage') ?? 0;

        // Calculate unique engineers assigned across all projects
        $engineerCount = AssignedEngineer::whereNotNull('user_id')->distinct('user_id')->count();

        // Prepare project data with progress calculation
        $projectsData = $projects->map(function ($project) {
            $totalStories = 0;
            $completedStories = 0; // In a real app, you'd have a 'status' on stories

            foreach ($project->epics as $epic) {
                $totalStories += $epic->stories->count();
            }

            $progress = 0; // Reset progress logic as it relied on status

            return [
                'id' => $project->id,
                'name' => $project->name,
                'progress' => $progress,
                'roi' => $project->roi_percentage,
                'cost' => $project->total_project_cost,
                'chef' => $project->chef ? $project->chef->first_name . ' ' . $project->chef->last_name : 'Unassigned',
                'has_strategic' => !!$project->roi_analysis_summary,
                'has_technical' => $project->epics->count() > 0 || !empty($project->architecture_plan),
                'has_stack' => !!$project->stack_name,
                'steps' => $project->epics->map(function ($epic) {
                    return [
                        'title' => $epic->title,
                        'stories' => $epic->stories->map(fn($s) => $s->title)
                    ];
                })
            ];
        });

        return response()->json([
            'stats' => [
                'total_projects' => $totalProjects,
                'total_budget' => $totalCost,
                'total_gains' => $totalGains,
                'average_roi' => round($averageRoi, 2),
                'engineer_count' => $engineerCount,
                'talent_utilization' => $engineerCount > 0 ? round(($engineerCount / max(User::count(), 1)) * 100) : 0,
            ],
            'projects' => $projectsData
        ]);
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
                    'name', 'description',
                    'start_date', 'actual_end_date',
                    'estimated_duration_months', 'total_capex', 'total_opex',
                    'total_project_cost', 'total_gain_value', 'annual_opex_value',
                    'roi_analysis_summary'
                ]);

                // Ensure roi_analysis_summary is a string
                if (isset($projectData['roi_analysis_summary']) && is_array($projectData['roi_analysis_summary'])) {
                    $projectData['roi_analysis_summary'] = implode("\n", $projectData['roi_analysis_summary']); 
                }

                // Map project_name to name if name is missing (for AI compatibility)
                $projectData['name'] = ($request->name && strlen($request->name) > 0) ? $request->name : $request->project_name;
                
                // Final validation check for name
                if (empty($projectData['name'])) {
                    throw new \Exception("The project name is still empty after synthesis. Please provide a name in Step 1.");
                }

                // Default values if missing
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
                        $mitigation = $risk['mitigation_strategy'] ?? '';
                        if (is_array($mitigation)) {
                            $mitigation = implode("\n", $mitigation);
                        }

                        $project->risks()->create([
                            'risk_name' => $risk['risk_name'],
                            'impact' => $risk['impact'],
                            'probability' => $risk['probability'],
                            'mitigation_strategy' => $mitigation
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
                                        $instructions = $taskData['instructions'] ?? '';
                                        if (is_array($instructions)) {
                                            $instructions = implode("\n", $instructions);
                                        }

                                        $story->tasks()->create([
                                            'role' => $taskData['role'],
                                            'level' => $taskData['level'] ?? null,
                                            'title' => $taskData['title'],
                                            'instructions' => $instructions,
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
        $project = Project::with(['chef', 'assignedEngineers.specialization', 'estimatedGains', 'infrastructureCosts', 'roiProjections', 'kpis', 'risks', 'epics.stories.tasks'])->find($id);

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
     * Save the Stack Analysis Configuration for a Project
     */
    public function saveStack(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Expanded validation
        $validator = Validator::make($request->all(), [
            'stack_analysis_data' => 'nullable|array', // The new full JSON
            'stack_name' => 'nullable|string|max:255',
            // Legacy/Partial support
            'architecture_plan' => 'nullable', 
            'recommended_stack' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // If strict stack_analysis_data is passed, use it
        if ($request->has('stack_analysis_data')) {
            $project->stack_analysis_data = $request->stack_analysis_data;

            // Auto-extract stack name from the primary recommendation if not explicitly passed
            if (!$request->has('stack_name') && isset($request->stack_analysis_data['primary_recommendation']['strategy_name'])) {
                $project->stack_name = $request->stack_analysis_data['primary_recommendation']['strategy_name'];
            }
        }

        // Allow manual overrides or legacy saving
        if ($request->has('stack_name')) {
            $project->stack_name = $request->stack_name;
        }
        if ($request->has('architecture_plan')) {
            $project->architecture_plan = $request->architecture_plan;
        }
        if ($request->has('recommended_stack')) {
            $project->recommended_stack = $request->recommended_stack;
        }
        
        $project->save();

        return response()->json([
            'message' => 'Stack strategy saved successfully.',
            'project' => $project
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