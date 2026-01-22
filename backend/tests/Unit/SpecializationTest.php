<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Specialization;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SpecializationTest extends TestCase
{
    use RefreshDatabase;

    public function test_specialization_has_many_users()
    {
        $spec = Specialization::factory()->create();
        $user = User::factory()->create(['specialization_id' => $spec->id]);

        $this->assertTrue($spec->users->contains($user));
        $this->assertEquals($spec->id, $user->specialization_id);
    }
}
