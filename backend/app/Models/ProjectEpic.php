<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectEpic extends Model
{
    protected $fillable = ['project_id', 'title', 'description', 'external_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function stories()
    {
        return $this->hasMany(ProjectStory::class);
    }
}
