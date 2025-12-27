<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignedEngineer extends Model
{
    protected $fillable = [
        'project_id',
        'specialization_id',
        'phase',
        'months_assigned'
    ];

    protected $appends = ['total_cost'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function specialization()
    {
        return $this->belongsTo(Specialization::class);
    }

    // Accessor to calculate cost on the fly
    public function getTotalCostAttribute()
    {
        // total = monthly salary from relationship * number of months
        return $this->specialization ? ($this->specialization->salary * $this->months_assigned) : 0;
    }
}
