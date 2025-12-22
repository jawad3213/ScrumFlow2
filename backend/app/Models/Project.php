<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'status', 'user_id'];

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

    // Un projet a une analyse AI (validé par le chef => stocké dans ai_analyses)
    public function analysis()
    {
        return $this->hasOne(AiAnalysis::class); 
        
    }
}
