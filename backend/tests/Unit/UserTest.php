<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Specialization;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user belongs to a specialization.
     */
    public function test_user_has_specialization_relationship()
    {
        $specialization = Specialization::factory()->create();

        $user = User::factory()->create([
            'specialization_id' => $specialization->id
        ]);

        $this->assertInstanceOf(Specialization::class, $user->specialization);
        $this->assertEquals($specialization->id, $user->specialization->id);
    }
}
