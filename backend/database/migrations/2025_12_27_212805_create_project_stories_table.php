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
        Schema::create('project_stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_epic_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('story_points')->default(0);
            $table->json('acceptance_criteria')->nullable();
            $table->string('external_id')->nullable(); // For AI reference like US-1.1
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_stories');
    }
};
