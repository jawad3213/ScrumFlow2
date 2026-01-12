<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->json('architecture_plan')->nullable()->after('roi_analysis_summary');
            $table->json('recommended_stack')->nullable()->after('architecture_plan');
            $table->string('stack_name')->nullable()->after('recommended_stack');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['architecture_plan', 'recommended_stack', 'stack_name']);
        });
    }
};
