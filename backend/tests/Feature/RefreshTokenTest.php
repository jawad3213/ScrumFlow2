<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class RefreshTokenTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Use localhost for testing
        config(['sanctum.stateful' => ['localhost']]);
    }

    public function test_user_can_login_and_receive_tokens()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'user'])
            ->assertCookie('refresh_token');
        
        $this->assertDatabaseHas('refresh_tokens', [
            'user_id' => $user->id
        ]);
    }

    public function test_user_can_refresh_token_via_cookie()
    {
        $user = User::factory()->create();
        $rawToken = 'test-refresh-token';
        
        \App\Models\RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $rawToken),
            'expires_at' => now()->addDays(1),
        ]);

        $response = $this->call('POST', '/api/refresh-token', [], ['refresh_token' => $rawToken]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type'])
            ->assertCookie('refresh_token');

        // Check rotation: old token should be gone
        $this->assertDatabaseMissing('refresh_tokens', [
            'token' => hash('sha256', $rawToken)
        ]);

        // New token should be in DB
        $this->assertDatabaseHas('refresh_tokens', [
            'user_id' => $user->id
        ]);
    }

    public function test_user_can_access_me_endpoint_after_refresh()
    {
        $user = User::factory()->create();
        $rawToken = 'test-refresh-token';
        
        \App\Models\RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $rawToken),
            'expires_at' => now()->addDays(1),
        ]);

        // 1. Refresh to get access token
        $refreshResponse = $this->call('POST', '/api/refresh-token', [], ['refresh_token' => $rawToken]);
        
        $accessToken = $refreshResponse->json('access_token');

        // 2. Use access token to call /api/me
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $accessToken
        ])->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_refresh_token_fails_with_invalid_cookie()
    {
        $response = $this->call('POST', '/api/refresh-token', [], ['refresh_token' => 'invalid-token']);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Token de rafraîchissement invalide ou expiré.']);
    }
}
