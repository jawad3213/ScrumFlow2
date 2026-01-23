<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectKpi extends Model
{
    protected $fillable = [
        'project_id',
        'metric_name',
        'target_value',
        'measurement_method'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
