<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 
        'description', 
        'start_date', 
        'planned_end_date',
        'actual_end_date',
        'user_id',
        'estimated_duration_months',
        'total_capex',
        'total_opex',
        'total_project_cost',
        'total_gain_value',
        'annual_opex_value',
        'roi_percentage',
        'break_even_point_months',
        'roi_analysis_summary',
        'architecture_plan',
        'recommended_stack',
        'stack_name',
        'stack_analysis_data'
    ];

    protected $casts = [
        'architecture_plan' => 'array',
        'recommended_stack' => 'array',
        'stack_analysis_data' => 'array',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::saving(function ($project) {
            // Automatically calculate planned_end_date
            if ($project->start_date && $project->estimated_duration_months > 0) {
                $project->planned_end_date = Carbon::parse($project->start_date)
                    ->addMonths(round($project->estimated_duration_months))
                    ->toDateString();
            }
        });
    }


    // Un projet appartient à un Chef
    public function chef()
    {
        return $this->belongsTo(User::class, 'user_id');
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

    public function epics()
    {
        return $this->hasMany(ProjectEpic::class);
    }
}
