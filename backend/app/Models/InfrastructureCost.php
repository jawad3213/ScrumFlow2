<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfrastructureCost extends Model
{
    protected $fillable = [
        'project_id',
        'type',
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
