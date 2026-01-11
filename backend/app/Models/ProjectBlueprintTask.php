<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectBlueprintTask extends Model
{
    protected $fillable = [
        'project_story_id', 
        'role', 
        'level',
        'title', 
        'instructions', 
        'hours', 
        'external_id'
    ];

    public function story()
    {
        return $this->belongsTo(ProjectStory::class, 'project_story_id');
    }
}
