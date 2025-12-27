<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoiProjection extends Model
{
    protected $fillable = [
        'project_id',
        'year_number',
        'cumulative_costs',
        'cumulative_gains',
        'net_cash_flow',
        'roi_percentage'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
