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
        config(['sanctum.stateful' => ['foo.test']]);
        $this->withoutMiddleware(\Illuminate\Cookie\Middleware\EncryptCookies::class);
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

        $response = $this->call(
            'POST',
            '/api/refresh-token',
            [],
            ['refresh_token' => $rawToken] // Cookies array
        );

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type'])
            ->assertCookie('refresh_token');
    }

    public function test_refresh_token_fails_with_invalid_cookie()
    {
        $response = $this->call(
            'POST',
            '/api/refresh-token',
            [],
            ['refresh_token' => 'invalid-token']
        );

        $response->assertStatus(401)
            ->assertJson(['message' => 'Token de rafraîchissement invalide ou expiré.']);
    }
}
