<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use App\Models\Specialization;
use Laravel\Sanctum\Sanctum;

class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    private function createChefWithEmployee($overrides = [])
    {
        $chef = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($chef);

        $spec = Specialization::factory()->create();
        $employee = Employee::create(array_merge([
            'user_id' => $chef->id,
            'first_name' => 'Test',
            'last_name' => 'Employee',
            'email' => 'test@example.com',
            'specialization_id' => $spec->id,
        ], $overrides));

        return [$chef, $employee, $spec];
    }

    public function test_can_list_own_employees()
    {
        [$chef, $employee1] = $this->createChefWithEmployee();
        Employee::create([
            'user_id' => $chef->id,
            'first_name' => 'Second',
            'last_name' => 'Employee',
            'email' => 'second@example.com',
            'specialization_id' => $employee1->specialization_id,
        ]);

        $response = $this->getJson('/api/employees');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_cannot_see_other_chef_employees()
    {
        // Chef A has an employee
        $chefA = User::factory()->create(['role' => 'chef']);
        $spec = Specialization::factory()->create();
        Employee::create([
            'user_id' => $chefA->id,
            'first_name' => 'ChefA',
            'last_name' => 'Employee',
            'email' => 'chefa@example.com',
            'specialization_id' => $spec->id,
        ]);

        // Chef B logs in — should see 0 employees
        $chefB = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($chefB);

        $response = $this->getJson('/api/employees');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_can_create_employee()
    {
        $chef = User::factory()->create(['role' => 'chef']);
        Sanctum::actingAs($chef);

        Specialization::create([
            'name' => 'Backend Developer',
            'level' => 'Senior',
            'salary' => 10000,
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

        $this->assertDatabaseHas('employees', [
            'email' => 'john.doe@example.com',
            'user_id' => $chef->id,
        ]);
    }

    public function test_can_update_own_employee()
    {
        [$chef, $employee] = $this->createChefWithEmployee();

        $response = $this->putJson("/api/employees/{$employee->id}", [
            'first_name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['first_name' => 'Updated Name']);
    }

    public function test_can_delete_own_employee()
    {
        [$chef, $employee] = $this->createChefWithEmployee();

        $response = $this->deleteJson("/api/employees/{$employee->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
    }

    public function test_can_list_available_employees()
    {
        [$chef, $employee1] = $this->createChefWithEmployee(['is_engaged' => false]);
        Employee::create([
            'user_id' => $chef->id,
            'first_name' => 'Engaged',
            'last_name' => 'Employee',
            'email' => 'engaged@example.com',
            'specialization_id' => $employee1->specialization_id,
            'is_engaged' => true,
        ]);

        $response = $this->getJson('/api/employees/available');

        $response->assertStatus(200)
            ->assertJsonCount(1); // Only the non-engaged one
    }

    public function test_can_bulk_delete_own_employees()
    {
        [$chef, $employee1] = $this->createChefWithEmployee();
        $employee2 = Employee::create([
            'user_id' => $chef->id,
            'first_name' => 'Bulk',
            'last_name' => 'Delete',
            'email' => 'bulk@example.com',
            'specialization_id' => $employee1->specialization_id,
        ]);

        $ids = [$employee1->id, $employee2->id];

        $response = $this->postJson('/api/employees/bulk-delete', ['ids' => $ids]);

        $response->assertStatus(200);
        foreach ($ids as $id) {
            $this->assertDatabaseMissing('employees', ['id' => $id]);
        }
    }
}
