<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'specialization_id',
        'is_engaged',
    ];

    /**
     * The chef/owner who manages this employee.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The employee's specialization (role + level).
     */
    public function specialization()
    {
        return $this->belongsTo(Specialization::class);
    }
}
