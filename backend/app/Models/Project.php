<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Project extends Model
{
    protected $fillable = [
        'name', 
        'description', 
        'start_date', 
        'planned_end_date',
        'actual_end_date',
        'status', 
        'user_id',
        'estimated_duration_months',
        'total_capex',
        'total_opex',
        'total_project_cost',
        'total_gain_value',
        'annual_opex_value',
        'roi_percentage',
        'break_even_point_months',
        'roi_analysis_summary'
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::saving(function ($project) {
            // Logic for start_date when switching to 'active'
            if ($project->isDirty('status') && $project->status === 'active') {
                if (empty($project->start_date)) {
                    $project->start_date = Carbon::now()->toDateString();
                }
            }

            // Automatically calculate planned_end_date
            // Triggered if we have a start_date and estimated_duration_months
            if ($project->start_date && $project->estimated_duration_months > 0) {
                // Calculation: start_date + estimated_duration_months
                $project->planned_end_date = Carbon::parse($project->start_date)
                    ->addMonths(round($project->estimated_duration_months))
                    ->toDateString();
            }

            // Logic for actual_end_date when switching to 'completed'
            if ($project->isDirty('status') && $project->status === 'completed') {
                $project->actual_end_date = Carbon::now()->toDateString();
            }
        });
    }

    // Un projet appartient à un Chef
    public function chef()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Un projet a plusieurs Sprints
    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }

    public function assignedEngineers()
    {
        return $this->hasMany(AssignedEngineer::class);
    }

    public function estimatedGains()
    {
        return $this->hasMany(EstimatedGain::class);
    }

    public function infrastructureCosts()
    {
        return $this->hasMany(InfrastructureCost::class);
    }

    public function roiProjections()
    {
        return $this->hasMany(RoiProjection::class);
    }

    public function kpis()
    {
        return $this->hasMany(ProjectKpi::class);
    }

    public function risks()
    {
        return $this->hasMany(ProjectRisk::class);
    }
}
