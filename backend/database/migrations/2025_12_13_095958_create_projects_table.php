<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('projects', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        $table->date('start_date');
        $table->date('end_date')->nullable();
        $table->text('description')->nullable();
        $table->string('status')->default('pending'); // pending, active, completed
        $table->text('ai_analysis_json')->nullable(); // On stocke la réponse de l'IA ici temporairement
        $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
