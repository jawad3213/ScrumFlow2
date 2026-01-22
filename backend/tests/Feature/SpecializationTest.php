<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Specialization;
use Laravel\Sanctum\Sanctum;

class SpecializationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_specializations()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Specialization::factory()->create(['name' => 'Backend']);
        Specialization::factory()->create(['name' => 'Frontend']);

        $response = $this->getJson('/api/specializations');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_can_create_specialization()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $payload = [
            'name' => 'DevOps',
            'level' => 'Senior',
            'salary' => 15000
        ];

        $response = $this->postJson('/api/specializations', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'DevOps']);
    }

    public function test_can_update_specialization()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $spec = Specialization::factory()->create([
            'name' => 'Old Name',
            'salary' => 5000
        ]);

        $payload = [
            'name' => 'New Name',
            'salary' => 6000
        ];

        $response = $this->putJson("/api/specializations/{$spec->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'New Name']);
    }

    public function test_can_delete_specialization()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $spec = Specialization::factory()->create();

        $response = $this->deleteJson("/api/specializations/{$spec->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('specializations', ['id' => $spec->id]);
    }

    public function test_can_bulk_delete_specializations()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $specs = Specialization::factory()->count(3)->create();
        $ids = $specs->pluck('id')->toArray();

        $response = $this->postJson('/api/specializations/bulk-delete', [
            'ids' => $ids
        ]);

        $response->assertStatus(204);
        foreach ($ids as $id) {
            $this->assertDatabaseMissing('specializations', ['id' => $id]);
        }
    }
}
