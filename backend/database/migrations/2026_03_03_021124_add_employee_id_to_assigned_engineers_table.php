<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds employee_id FK to assigned_engineers, replacing the old user_id FK
     * since employees are now in a dedicated table.
     */
    public function up(): void
    {
        Schema::table('assigned_engineers', function (Blueprint $table) {
            // Add the new employee_id column
            $table->foreignId('employee_id')->nullable()->after('user_id')
                  ->constrained('employees')->onDelete('set null');

            // Drop the old user_id FK and column
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assigned_engineers', function (Blueprint $table) {
            // Re-add user_id
            $table->foreignId('user_id')->nullable()->after('specialization_id')
                  ->constrained('users')->onDelete('set null');

            // Drop employee_id
            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');
        });
    }
};
