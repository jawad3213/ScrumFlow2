<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Added this line
use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level',
        'salary',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
