<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable; 

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'avatar',
        'google_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Append computed attributes to JSON.
     */
    protected $appends = ['has_password'];

    /**
     * Check if user has a password set (false for Google-only users).
     */
    public function getHasPasswordAttribute(): bool
    {
        return !is_null($this->attributes['password'] ?? null);
    }

    public function specialization()
    {
        return $this->belongsTo(Specialization::class);
    }

    /**
     * The employees owned by this chef user.
     */
    public function employees()
    {
        return $this->hasMany(\App\Models\Employee::class);
    }

    public function refreshTokens()
    {
        return $this->hasMany(\App\Models\RefreshToken::class);
    }
}