<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Specialization;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Mail;

class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_employees()
    {
        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        User::factory()->create(['role' => 'employee']);
        User::factory()->create(['role' => 'employee']);

        $response = $this->getJson('/api/employees');

        // Should return the 2 employees. The acting user is chef.
        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_can_create_employee()
    {
        Mail::fake();

        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        // Pre-requisite: Specialization must exist
        Specialization::create([
            'name' => 'Backend Developer',
            'level' => 'Senior',
            'salary' => 10000
        ]);

        $payload = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'specialization_name' => 'Backend Developer',
            'level' => 'Senior',
        ];

        $response = $this->postJson('/api/employees', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);

        $this->assertDatabaseHas('users', ['email' => 'john.doe@example.com', 'role' => 'employee']);
    }

    public function test_can_update_employee()
    {
        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        $employee = User::factory()->create(['role' => 'employee', 'first_name' => 'Old Name']);

        $payload = [
            'first_name' => 'New Name',
            // We don't send specialization info, so it shouldn't try to look it up if not present
        ];

        $response = $this->putJson("/api/employees/{$employee->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['first_name' => 'New Name']);
    }

    public function test_can_delete_employee()
    {
        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        $employee = User::factory()->create(['role' => 'employee']);

        $response = $this->deleteJson("/api/employees/{$employee->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $employee->id]);
    }

    public function test_can_list_available_employees()
    {
        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        // Create 3 employees, but only 2 should be 'available' if one is assigned somewhere (if logic exists)
        // or simply test that they return correctly.
        User::factory()->count(3)->create(['role' => 'employee']);

        $response = $this->getJson('/api/employees/available');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_bulk_delete_employees()
    {
        $user = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($user);

        $employees = User::factory()->count(3)->create(['role' => 'employee']);
        $ids = $employees->pluck('id')->toArray();

        $response = $this->postJson('/api/employees/bulk-delete', [
            'ids' => $ids
        ]);

        $response->assertStatus(200);
        foreach ($ids as $id) {
            $this->assertDatabaseMissing('users', ['id' => $id]);
        }
    }
}
