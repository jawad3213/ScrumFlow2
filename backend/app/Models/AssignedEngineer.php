<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AssignedEngineer extends Model
{
    use HasFactory;
    protected $fillable = [
        'project_id',
        'specialization_id',
        'employee_id',
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

    /**
     * The employee assigned to this role.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // Accessor to calculate cost on the fly
    public function getTotalCostAttribute()
    {
        // total = monthly salary from relationship * number of months
        return $this->specialization ? ($this->specialization->salary * $this->months_assigned) : 0;
    }
}
