<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->date('start_date')->nullable();
            $table->date('planned_end_date')->nullable();  // The goal/deadline
            $table->date('actual_end_date')->nullable();
            $table->text('description')->nullable();

            // AI Analysis Attributes
            $table->decimal('estimated_duration_months', 8, 2)->nullable();
            $table->decimal('total_capex', 15, 2)->default(0);
            $table->decimal('total_opex', 15, 2)->default(0);
            $table->decimal('total_project_cost', 15, 2)->nullable();
            $table->decimal('total_gain_value', 15, 2)->nullable();
            $table->decimal('annual_opex_value', 15, 2)->default(0);
            $table->decimal('roi_percentage', 8, 2)->nullable();
            $table->decimal('break_even_point_months', 8, 2)->nullable();
            $table->longText('roi_analysis_summary')->nullable();

            // Stack Analysis & Architecture Attributes
            $table->json('stack_analysis_data')->nullable(); // Stores the full AI JSON response
            $table->json('architecture_plan')->nullable();
            $table->json('recommended_stack')->nullable();
            $table->string('stack_name')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
