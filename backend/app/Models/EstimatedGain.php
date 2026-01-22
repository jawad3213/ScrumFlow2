<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EstimatedGain extends Model
{
    use HasFactory;
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
