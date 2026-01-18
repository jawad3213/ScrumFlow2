<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_own_profile()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJson(['email' => $user->email]);
    }

    public function test_can_update_own_profile()
    {
        $user = User::factory()->create(['first_name' => 'Old']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/profile', [
            'first_name' => 'New',
            'last_name' => 'Name'
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['first_name' => 'New']);
    }

    public function test_can_update_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword')
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/profile/password', [
            'current_password' => 'oldpassword',
            'new_password' => 'newpassword',
            'new_password_confirmation' => 'newpassword'
        ]);

        $response->assertStatus(200);
        $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));
    }
}
