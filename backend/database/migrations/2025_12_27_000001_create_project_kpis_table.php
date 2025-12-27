<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('metric_name');
            $table->string('target_value');
            $table->string('measurement_method');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_kpis');
    }
};
