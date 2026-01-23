<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectStory extends Model
{
    protected $fillable = [
        'project_epic_id', 
        'title', 
        'description', 
        'story_points', 
        'acceptance_criteria', 
        'external_id'
    ];

    protected $casts = [
        'acceptance_criteria' => 'array'
    ];

    public function epic()
    {
        return $this->belongsTo(ProjectEpic::class, 'project_epic_id');
    }

    public function tasks()
    {
        return $this->hasMany(ProjectBlueprintTask::class, 'project_story_id');
    }
}
