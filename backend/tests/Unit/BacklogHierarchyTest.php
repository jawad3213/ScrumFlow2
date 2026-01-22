<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Models\ProjectEpic;
use App\Models\ProjectStory;
// removed unused Task import
use Illuminate\Foundation\Testing\RefreshDatabase;

class BacklogHierarchyTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_has_epics()
    {
        $project = Project::factory()->create();
        $epic = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'Epic Title',
            'description' => 'Epic Description'
        ]);

        $this->assertTrue($project->epics->contains($epic));
    }

    public function test_epic_has_stories()
    {
        $epic = ProjectEpic::create([
            'project_id' => Project::factory()->create()->id,
            'title' => 'Epic Title',
            'description' => 'Epic Description'
        ]);
        
        $story = ProjectStory::create([
            'project_epic_id' => $epic->id,
            'title' => 'Story Title',
            'description' => 'Story Description'
        ]);

        $this->assertTrue($epic->stories->contains($story));
    }

    public function test_story_has_tasks()
    {
        $story = ProjectStory::create([
            'project_epic_id' => ProjectEpic::create(['project_id' => Project::factory()->create()->id, 'title' => 'E', 'description' => 'D'])->id,
            'title' => 'Story Title',
            'description' => 'Story Description'
        ]);

        $task = $story->tasks()->create([
            'title' => 'Task Title',
            'role' => 'Backend',
            'instructions' => 'Follow steps',
            'hours' => 5
        ]);

        $this->assertTrue($story->tasks->contains($task));
    }
}
