<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectRisk extends Model
{
    protected $fillable = [
        'project_id',
        'risk_name',
        'impact',
        'probability',
        'mitigation_strategy'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
