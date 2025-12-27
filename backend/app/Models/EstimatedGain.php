<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstimatedGain extends Model
{
    protected $fillable = [
        'project_id',
        'item_name',
        'cost_mad',
        'formule',
        'description'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
