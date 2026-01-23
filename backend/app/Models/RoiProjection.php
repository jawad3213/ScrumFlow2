<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoiProjection extends Model
{
    use HasFactory;
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
